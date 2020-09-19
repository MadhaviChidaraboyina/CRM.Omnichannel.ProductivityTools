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

<# parameters examples
  - 'generate' mode
    $mode = "generate"
    $sourceDataxmlPath = " D:\CRM.OmniChannel.C1Provisioning\solutions\OmnichannelBase\PVSPackage\OmnichannelBase\CmtDataFiles\data_1033\data.xml"
    $referenceFilePath = "D:\CRM.OmniChannel.C1Provisioning\Localize\data_rules.xml"
    $jsonFilePath = "D:\CRM.OmniChannel.C1Provisioning\Localize\Temp\1031\solutions\OmnichannelBase\PVSPackage\OmnichannelBase\CmtDataFiles\data_1031\data.json"

  - 'importjson' mode
    $mode = "importjson"
    $sourceDataxmlPath = " D:\CRM.OmniChannel.C1Provisioning\solutions\OmnichannelBase\PVSPackage\OmnichannelBase\CmtDataFiles\data_1033\data.xml"
    $referenceFilePath = "D:\CRM.OmniChannel.C1Provisioning\Localize\data_rules.xml"
    $jsonFilePath = "D:\CRM.OmniChannel.C1Provisioning\Localize\Temp\1031\solutions\OmnichannelBase\PVSPackage\OmnichannelBase\CmtDataFiles\data_1031\data.json"
    $outputDataXmlPath = "D:\CRM.OmniChannel.C1Provisioning\solutions\OmnichannelBase\PVSPackage\OmnichannelBase\CmtDataFiles\data_1031\data.xml"
#>

# Write input parameters
Switch ($mode) {
    'generate' { Write-Host "-mode $mode -sourceDataxmlPath $sourceDataxmlPath -referenceFilePath $referenceFilePath -jsonFilePath $jsonFilePath"; break }
    'importjson' { Write-Host "-mode $mode -sourceDataxmlPath $sourceDataxmlPath -referenceFilePath $referenceFilePath -jsonFilePath $jsonFilePath -outputDataXmlPath $outputDataXmlPath"; break }
}

Add-Type -AssemblyName "System.Web"
Add-type -AssemblyName "System.xml"
Add-type -AssemblyName "System.xml.linq"

# '$localizableFields' is a global variable which gets set within 'ReadReferenceData' function extracts fields that requires localization based on info in '[data]_rules.xml'
#   note: [data] represents 'data', 'data_localized'or 'data_cannedmessage'
#   where value of name attribute of 'entity' and 'field' become a key.
#   in the following example,
#   'msdyn_ocsystemmessage@msdyn_messagetext', ''msdyn_ocsystemmessage@msdyn_messagedescription' & 'msdyn_ocsystemmessage@msdyn_name 'become the key values
#     <entity name="msdyn_ocsystemmessage">
#       <field name="msdyn_messagetext" localizableAttribute="value" loc="Yes" />
#       <field name="msdyn_messagedescription" localizableAttribute="value" loc="Yes" />
#       <field name="msdyn_name" localizableAttribute="value" loc="Yes" />
#     </entity>
$localizableFields = New-Object "system.collections.generic.dictionary[string,object]"

function ImportTranslatedJsonFile {
    if (-not (Test-Path $sourceDataxmlPath)) {
        throw "Data xml file not found at $sourceDataxmlPath"
        exit 1
    }

    if (-not (Test-Path $jsonFilePath)) {
        throw "Translated JSON file not found at $jsonFilePath"
        exit 1
    }

    Write-Verbose "Bufferring translated JSON contents..."
    $jsonResources = @{}
    $json = Get-Content -Raw -Path $jsonFilePath -Encoding UTF8 

    [void][System.Reflection.Assembly]::LoadWithPartialName("System.Web.Extensions")
    $jsonserial = New-Object -TypeName System.Web.Script.Serialization.JavaScriptSerializer 
    $jsonserial.MaxJsonLength = [int]::MaxValue
    $jsonObj = $jsonserial.DeserializeObject($json)

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

    Write-Verbose "Json reading completed"

    # Read 'xxx_rules.xml' file and create '$localizableFields' dictionary
    ReadReferenceData

    Write-Verbose "Reading source data xml file..."
    try {
        $reader = [System.Xml.XmlReader]::Create($sourceDataxmlPath)

        $xmlSettings = [System.Xml.XmlWriterSettings]::new()
        $xmlSettings.Indent = $true
        $xmlSettings.Encoding = [System.Text.Encoding]::UTF8

        $writer = [System.Xml.XmlWriter]::Create($outputDataXmlPath, $xmlSettings)
        $recordId = ""
        $entityName = ""

        Write-Verbose "Writing translated data xml file..."
        while ($reader.Read()) {
            switch ($reader.NodeType) {
                Element {
                    $writer.WriteStartElement($reader.Prefix, $reader.LocalName, $reader.NamespaceURI)
                    if ($reader.LocalName.Equals("entity")) {
                        $entityName = $reader.GetAttribute("name");
                        $writer.WriteAttributes($reader, $true);
                    }
                    elseif ($reader.LocalName.Equals("record") -or $reader.LocalName.Equals("activitypointerrecords")) {
                        $recordId = $reader.GetAttribute("id");
                        $writer.WriteAttributes($reader, $true);
                    }
                    elseif ($reader.LocalName.Equals("field")) {
                        $name = $reader.GetAttribute("name");
                        $key = $entityName + "@" + $name;

                        # Check if '$localizableFields' contains $key
                        if (-not $localizableFields.ContainsKey($key)) {
                            $writer.WriteAttributes($reader, $true)
                        }
                        else {
                            # '$key' found in '$localizableFields' which means the field is a localizable field
                            $transAttr = $localizableFields[$key].Attribute
                            $comment = $localizableFields[$key].Comment

                            for ($i = 0; $i -lt $reader.AttributeCount; $i++) {
                                $reader.MoveToAttribute($i);
                                $atrName = $reader.Name;
                                $atrValue = $reader.Value;

                                if ($atrName.Equals($transAttr)) {
                                    $jsonKey = $key + "_" + $recordId;

                                    # Check if '$jsonResources' contains '$jsonKey' which is in the format of '$entityName@$fieldName_$recordId'
                                    # e.g) "msdyn_presence@msdyn_name_f523f628-c07a-e811-8162-000d3aa11f50"
                                    # set the translated string(s) to '$atrValue' so it is written in the localized '[data].xml' file
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
                                                Write-Verbose "Missing translations for \t" + $jsonKey + "\t" + $key
                                            }
                                        }
                                        else {
                                            if ($comment -ieq "json") {
                                                Throw "Check JSON parser setting in LSS file - Enable to include dev comments in generated .json file. "
                                            }
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

    Write-Verbose "Completed."
}

function GenerateJsonFile {
    if (-not (Test-Path $sourceDataxmlPath)) {
        throw "Data xml file not found at $sourceDataxmlPath"
        exit 1
    }

    $embedJsonResIds = @{}
    $jsonObj2 = New-Object -TypeName Newtonsoft.Json.Linq.JObject

    # Read 'xxx_rules.xml' file and create '$localizableFields' dictionary
    ReadReferenceData
   
    Write-Verbose "Reading source data.xml file to generate translatable json file..."
    try {
        $source = [System.Xml.XmlReader]::Create($sourceDataxmlPath)
        while ($source.Read()) {
            if ($source.NodeType -eq [System.Xml.XmlNodeType]::Element -and $source.Name -eq "entity") {
                $entityName = $source.GetAttribute("name")
                $subSrc = $source.ReadSubtree()

                while ($subSrc.Read()) {
                    if ($subSrc.NodeType -eq [System.Xml.XmlNodeType]::Element -and ($subSrc.Name -eq "record" -or $subSrc.Name -eq "activitypointerrecords")) {
                        $recordId = $subSrc.GetAttribute("id")
                    }

                    if ($subSrc.NodeType -eq [System.Xml.XmlNodeType]::Element -and $subSrc.Name -eq "field") {
                        $key = $entityName + "@" + $subSrc.GetAttribute("name")
                        $lookupGuid = ""

                        if (-not $localizableFields.ContainsKey($key)) {continue}
                        if ($localizableFields[$key].Attribute -eq "lookupentityname") {
                            $lookupGuid = $subSrc.GetAttribute("value")
                        }

                        $srcString = $subSrc.GetAttribute($localizableFields[$key].Attribute)
                        $fieldType = $localizableFields[$key].Comment
                        
                        # JSON embedded content, need to process separately
                        if ($fieldType -ieq "json") {
                            $srcString = [System.Net.WebUtility]::HtmlDecode($srcString)
                            $resId = $key + "_" + $recordId

                            $key = "zzzid" + ($embedJsonResIds.Count + 1)

                            $jObject = [Newtonsoft.Json.Linq.JArray]::Parse($srcString)

                            $jsonObj2.Add($key, (New-Object -TypeName Newtonsoft.Json.Linq.JArray -ArgumentList $jObject))

                            $embedJsonResIds.Add($key, $resId)
                            $jsonObj2.Add("_" + $key + ".comment", (New-Object -TypeName Newtonsoft.Json.Linq.JValue -ArgumentList $resId))

                            continue
                        }

                        if ([string]::IsNullOrEmpty($srcString)) {continue}

                        if ([string]::IsNullOrEmpty($lookupGuid)) {
                            $resId = $key + "_" + $recordId

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

    Write-Verbose "JSON file created at $jsonFilePath"
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

            if ($localizableFields.ContainsKey($key)) {
                $localizableFields[$key] = $fieldData
            }
            else {
                $localizableFields.Add($key, $fieldData)
            }
        }
    }
} 

$newtonsoftJsonDllPath = ""

function Import-NewtonsoftJsonModule {
    try {
        $imported = $false

        # $PSScriptRoot is the directory from which the script module is being executed.
        $newtonsoftJsonDllPath = [System.IO.Path]::Combine($PSScriptRoot,'Newtonsoft.Json.dll')
        if (Test-Path $newtonsoftJsonDllPath) {
            Write-Verbose "Import 'Newtonsoft.Json' module from $newtonsoftJsonDllPath"
            Import-Module $newtonsoftJsonDllPath
            $imported = $true
        }

        # Check if 'env:PKG_JSON' set, if so try to import from it
        if (!$imported -and (Test-Path env:PKG_JSON)) {
            $newtonsoftJsonDllPath = [System.IO.Path]::Combine($env:PKG_JSON,'lib\net40\Newtonsoft.Json.dll')
            if (Test-Path $newtonsoftJsonDllPath) {
                Write-Verbose "Import 'Newtonsoft.Json' module from $newtonsoftJsonDllPath"
                Import-Module $newtonsoftJsonDllPath
                $imported = $true
            }
        }

        # Attempt to import Newtonsoft.Json module if already installed on the machine
        if (-not $imported -and (Get-Module -ListAvailable -Name "Newtonsoft.Json")) {
           Import-Module Newtonsoft.Json
           $imported = $true
        }

        if (-not $imported) {
            $message = ("Failed to import 'Newtonsoft.Json' module. Please ensure to do either" +
            "`n  1. Place 'Newtonsoft.Json.dll' in $PSScriptRoot" +
            "`n  2. Install 'Newtonsoft.Json' nuget and set 'env:PKG_JSON' variable to `$(Build.Repository.LocalPath)\packages\Newtonsoft.Json.`$(NewtonsoftVersion)" +
            "`n  3. Install 'Newtonsoft.Json' module from 'PSGallery' (https://www.powershellgallery.com/packages/newtonsoft.json/1.0.1.2)")
            throw $message
            exit 1
        }
    } catch {
        $_ | % {Write-Error $_}
        $_.ScriptStackTrace | % {Write-Host $_}
        echo $_.Exception | format-list -force
        throw
        exit 1
    }
}

function main {
    Write-Verbose "$(get-date) Starting..."

    Import-NewtonsoftJsonModule

    if ($mode -ieq 'generate') {
        Write-Verbose "Generating JSON file from data.xml file"
        GenerateJsonFile
    }
    elseif ($mode -ieq 'importjson') {
        Write-Verbose "Importing JSON file translations into data.xml file"
        ImportTranslatedJsonFile
    }
    else {
        Write-Error "Invalid mode value (generate|importjson)."
    }

    Write-Verbose "$(get-date) Done.`n"
}

main