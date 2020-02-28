<#
    This script generates a JSON file from large data.xml file (only exposes translatable fields). 
    And also, imports translations from JSON file into data.xml file to generate the localized version of data.xml file.

        importjson - imports JSON string translations to create localized data.xml file

    Command Syntax:
    1)  In 'generate' mode, json file will be created with translatable strings (excludes any html data fields)
        DataXml2Json.ps1 -mode generate -sourceDataxmlPath <source data.xml file from core> -referenceFilePath <reference xml file path> -jsonFilePath <json file path>

    2) In 'importjson' mode, imports JSON string translations to create localized data.xml file
        DataXml2Json.ps1 -mode importjson -sourceDataxmlPath <source data.xml file from core> -referenceFilePath <reference xml file path> -jsonFilePath <translated json file path> -outputDataXmlPath <localized data.xml filepath> 
#>
param (
    
    [parameter(mandatory = $true)]
    [ValidateSet('generate', 'importjson')]
    [string] $mode,

    [parameter(mandatory = $true)]
    [string] $sourceDataxmlPath,
    
    [parameter(mandatory = $true)]
    [string] $referenceFilePath,

    [parameter(mandatory = $true)]
    [string] $jsonFilePath,
    
    [parameter(mandatory = $false)]
    [string] $outputDataXmlPath
)

Add-Type -AssemblyName System.Web
Add-type -AssemblyName "System.xml"
Add-type -AssemblyName "System.xml.linq"
$NJPath = Join-Path "$env:PKG_JSON" "\lib\net40\Newtonsoft.Json.dll"
Add-Type -Path $NJPath

# $sourceDataxmlPath = "E:\Projects\SampleData\data.xml"
# $referenceFilePath = "E:\Depots\SDIPED\Projects\CRM\TestDrive\UI\zTools\data_master.xml"
# $jsonFilePath = "E:\Projects\SampleData\2\data-2.json"
# $outputDataXmlPath = "E:\Projects\SampleData\data_out1.xml"
# $mode = "importjson" 

$fields = New-Object "system.collections.generic.dictionary[string,object]"

function ImportTranslatedJsonFile {
    if (-not (Test-Path $sourceDataxmlPath)) {
        throw "Data xml file not found at $sourceDataxmlPath"
        exit 1
    }

    if (-not (Test-Path $jsonFilePath)) {
        throw "Translated JSON file not found at $jsonFilePath"
        exit 1
    }

    Write-Host "Bufferring translated JSON contents..."
    $jsonResources = @{}
    $json = Get-Content -Raw -Path $jsonFilePath -Encoding UTF8 
    
    [void][System.Reflection.Assembly]::LoadWithPartialName("System.Web.Extensions")        
    $jsonserial = New-Object -TypeName System.Web.Script.Serialization.JavaScriptSerializer 
    $jsonserial.MaxJsonLength = [int]::MaxValue
    $jsonObj = $jsonserial.DeserializeObject($json)

    # $jsonObj = [Newtonsoft.Json.Linq.JObject]::Parse($json).ToString([Newtonsoft.Json.Formatting]::None);

    $jsonObj.Keys | % {
        if ($_.startsWith("_zzzid") -and $_.endsWith(".comment")) {
            $dummyKey = $_.Replace("_", "").Replace(".comment", "")
           
            $tr = ConvertTo-Json $jsonResources[$dummyKey] -Compress -Depth 100
            $tr = [System.Net.WebUtility]::HtmlEncode($tr)
            $jsonResources.Add($jsonObj[$_], $tr)
        }
        else {
            $jsonResources.add($_, $jsonObj[$_])
        }
    }

    Write-Host "Json reading completed"
    ReadReferenceData

    Write-Host "Reading source data xml file..."
    try {
        $reader = [System.Xml.XmlReader]::Create($sourceDataxmlPath)

        $xmlSettings = [System.Xml.XmlWriterSettings]::new()
        $xmlSettings.Indent = $true
        $xmlSettings.Encoding = [System.Text.Encoding]::UTF8
        
        $writer = [System.Xml.XmlWriter]::Create($outputDataXmlPath, $xmlSettings)
        $guid = ""
        $entityName = ""

        Write-Host "Writing translated data xml file..."
        while ($reader.Read()) {
            switch ($reader.NodeType) {
                Element {
                    $writer.WriteStartElement($reader.Prefix, $reader.LocalName, $reader.NamespaceURI)
                    if ($reader.LocalName.Equals("entity")) {
                        $entityName = $reader.GetAttribute("name");
                        $writer.WriteAttributes($reader, $true);
                    }
                    elseif ($reader.LocalName.Equals("record") -or $reader.LocalName.Equals("activitypointerrecords")) {
                        $guid = $reader.GetAttribute("id");
                        $writer.WriteAttributes($reader, $true);
                    }
                    elseif ($reader.LocalName.Equals("field")) {
                        $name = $reader.GetAttribute("name");
                        $key = $entityName + "@" + $name;

                        if (-not $fields.ContainsKey($key)) {$writer.WriteAttributes($reader, $true)}
                        else {
                            $transAttr = $fields[$key].Attribute
                            $comment = $fields[$key].Comment

                            for ($i = 0; $i -lt $reader.AttributeCount; $i++) {
                                $reader.MoveToAttribute($i);
                                $atrName = $reader.Name;
                                $atrValue = $reader.Value;

                                if ($atrName.Equals($transAttr)) {
                                    $jsonKey = $key + "_" + $guid;
                                    if ($jsonResources.ContainsKey($jsonKey)) {
                                        $atrValue = $jsonResources[$jsonKey]
                                    }
                                    else {
                                        if ($transAttr.Equals("lookupentityname")) {
                                            $lookupGuid = $reader.GetAttribute("value");
                                            $jsonKey = $key + "_" + $lookupGuid;
                                            if ($jsonResources.ContainsKey($jsonKey)) { 
                                                $atrValue = $jsonResources[$jsonKey]; 
                                            }
                                            else {
                                                Write-Host "Missing translations for \t" + $jsonKey + "\t" + $key
                                            }
                                        }
                                        else {
                                            if ($comment -ieq "json") {
                                                Throw "Check JSON parser setting in LSS file - Enable to include dev comments in generated .json file. "
                                            }

                                            Write-Host "Unable find items in data.xml $jsonKey $key"
                                        }
                                    }
                                }

                                $writer.WriteAttributeString($atrName, $atrValue);
                            }
                            $writer.WriteEndElement();
                        }
                    }
                    else {
                        $writer.WriteAttributes($reader, $true)
                    }

                    if ($reader.IsEmptyElement) {
                        $writer.WriteEndElement()
                    }
                }

                Text { $writer.WriteString($reader.Value) }
                Whitespace { $writer.WriteWhitespace($reader.Value) }
                SignificantWhitespace { $writer.WriteWhitespace($reader.Value) }
                CDATA { $writer.WriteCData($reader.Value) }
                EntityReference { $writer.WriteEntityRef($reader.Name) }
                XmlDeclaration { $writer.WriteProcessingInstruction($reader.Name, $reader.Value) }
                ProcessingInstruction { $writer.WriteProcessingInstruction($reader.Name, $reader.Value) }
                DocumentType { $writer.WriteDocType($reader.Name, $reader.GetAttribute("PUBLIC"), $reader.GetAttribute("SYSTEM"), $reader.Value) }
                Comment { $writer.WriteComment($reader.Value) }
                EndElement { $writer.WriteFullEndElement() }
            }
        }
    }
    finally {
        $writer.close()
        $reader.close()
    }

    Write-Host "Completed."
}

function GenerateJsonFile {
    if (-not (Test-Path $sourceDataxmlPath)) {
        throw "Data xml file not found at $sourceDataxmlPath"
        exit 1
    }

    $embedJsonResIds = @{}
    $jsonObj2 = New-Object -TypeName Newtonsoft.Json.Linq.JObject

    ReadReferenceData
   
    Write-Host "Reading source data.xml file to generate translatable json file..."
    try {
        $source = [System.Xml.XmlReader]::Create($sourceDataxmlPath)
        while ($source.Read()) {
            if ($source.NodeType -eq [System.Xml.XmlNodeType]::Element -and $source.Name -eq "entity") {
                $entityName = $source.GetAttribute("name")
                $subSrc = $source.ReadSubtree()
                while ($subSrc.Read()) {
                    if ($subSrc.NodeType -eq [System.Xml.XmlNodeType]::Element -and ($subSrc.Name -eq "record" -or $subSrc.Name -eq "activitypointerrecords")) {
                        $guid = $subSrc.GetAttribute("id")
                    }

                    if ($subSrc.NodeType -eq [System.Xml.XmlNodeType]::Element -and $subSrc.Name -eq "field") {
                        $key = $entityName + "@" + $subSrc.GetAttribute("name")
                        $lookupGuid = ""

                        if (-not $fields.ContainsKey($key)) {continue}
                        if ($fields[$key].Attribute -eq "lookupentityname") {
                            $lookupGuid = $subSrc.GetAttribute("value")
                        }

                        $srcString = $subSrc.GetAttribute($fields[$key].Attribute)
                        $fieldType = $fields[$key].Comment
                        
                        # JSON embedded content, need to process separately
                        if ($fieldType -ieq "json") {
                            $srcString = [System.Net.WebUtility]::HtmlDecode($srcString)
                            $resId = $key + "_" + $guid

                            $key = "zzzid" + ($embedJsonResIds.Count + 1)

                            $jObject = [Newtonsoft.Json.Linq.JArray]::Parse($srcString)                            

                            $jsonObj2.Add($key, (New-Object -TypeName Newtonsoft.Json.Linq.JArray -ArgumentList $jObject))

                            $embedJsonResIds.Add($key, $resId)
                            $jsonObj2.Add("_" + $key + ".comment", (New-Object -TypeName Newtonsoft.Json.Linq.JValue -ArgumentList $resId))

                            continue
                        }

                        if ([string]::IsNullOrEmpty($srcString)) {continue}

                        if ([string]::IsNullOrEmpty($lookupGuid)) {
                            $resId = $key + "_" + $guid

                            $jsonObj2.Add($resId, (New-Object -TypeName Newtonsoft.Json.Linq.JValue -ArgumentList $srcString) )

                            if ([string]::IsNullOrEmpty($fieldType)) {continue}
                            
                            $jsonObj2.Add("_" + $resId + ".comment", (New-Object -TypeName Newtonsoft.Json.Linq.JValue -ArgumentList (GetCommentValue $fieldType)))
                        }
                        else {
                            $lookupKey = $key + "_" + $lookupGuid
                            if ($jsonObj2.ContainsKey($lookupKey)) {continue}

                            $jsonObj2.Add($lookupKey, (New-Object -TypeName Newtonsoft.Json.Linq.JValue -ArgumentList $srcString))

                            if ([string]::IsNullOrEmpty($fieldType)) {continue}
                            $jsonObj2.Add("_" + $lookupKey + ".comment", (New-Object -TypeName Newtonsoft.Json.Linq.JValue -ArgumentList (GetCommentValue $fieldType)))
                        }
                    }
                }
            }
        }
    }
    finally {
        $source.close()
    }
    
    $jsonString2 = [Newtonsoft.Json.JsonConvert]::SerializeObject($jsonObj2, [Newtonsoft.Json.Formatting]::Indented) 
    $jsonString2 | Out-File $jsonFilePath -Force -Encoding utf8

    Write-Host "JSON file created at $jsonFilePath"
}

function GetCommentValue($comment) {
    if ($comment -ieq "address") {
        return "{Locked=!1041} Please use Japanese Katakana form for Japanese";
    }

    return $comment;
}

function ReadReferenceData {
    if (-not (Test-Path $referenceFilePath)) {
        throw "Reference file not found at $referenceFilePath"
        exit 1
    }

    $referenceFile = [System.Xml.Linq.XDocument]::Load($referenceFilePath)
    
    foreach ($field in $referenceFile.Descendants("field")) {
        if ($field.Parent -ne $null -and $field.Attribute("loc") -ne $null -and $field.Attribute("loc").Value -ieq "Yes") {

            $key = $field.Parent.Attribute("name").Value + "@" + $field.Attribute("name").Value
            $attr = $field.Attribute("localizableAttribute").Value
            $comment = $field.Attribute("Type").Value
            
            # Skipping HTML type data processing
            if ($comment -ne $null -and $comment -ieq "html") { continue }

            $fieldData = New-Object System.Object
            $fieldData | Add-Member -type NoteProperty -name Attribute -Value $attr
            $fieldData | Add-Member -type NoteProperty -name Comment -Value $comment
            
            if ($fields.ContainsKey($key)) {
                $fields[$key] = $fieldData
            }
            else {
                $fields.Add($key, $fieldData)
            }
        }
    }
} 

function main {
    Write-Host $(get-date) " Starting..."
    if ($mode -ieq 'generate') {
        GenerateJsonFile
    }
    elseif ($mode -ieq 'importjson') {
        Write-Host "Importing JSON file translations into data.xml file"
        ImportTranslatedJsonFile
    }
    else {
        Write-Error "Invalid mode value (generate|importjson)."
    }

    Write-Host $(get-date) " Done.`n"
}

main