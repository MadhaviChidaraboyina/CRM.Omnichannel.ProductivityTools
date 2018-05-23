namespace CopyTemplates
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Xml;
    class Program
	{
		static void Main(string[] args)
		{
			try
			{
				if (args.Count() == 3)
				{
					var repositoryRootPath = args[0];

					var crmSolutionName = args[1];

					var locPackagePath = args[2];

					Console.WriteLine("Arguments provided are XrmSolution Repository root Path = {0}, crm solution name = {1} and Loc packagePath ={2}", repositoryRootPath, crmSolutionName, locPackagePath);

					if (Directory.Exists(locPackagePath))
					{
						ProcessFolders(crmSolutionName, locPackagePath, repositoryRootPath);
					}
					else
					{
						Console.WriteLine("Directory doesn't exists hence skipped processing.");
					}
				}
				else
				{
					Console.WriteLine("ERROR!!Insufficient parameters passed.Please provide xrm solution root path, solution name and loc package path as arguments.");
					throw new InvalidOperationException();
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.ToString());
			}
		}

		private static void ProcessFolders(string solutionName, string sourcePackagePath, string xrmSolutionPath)
		{
			List<XmlNode> emailList = new List<XmlNode>();
			List<XmlNode> mailMergeList = new List<XmlNode>();
			List<XmlNode> contractList = new List<XmlNode>();

			var targetPath = Path.Combine(xrmSolutionPath, "solutions", solutionName, "Solution\\Templates");

			string[] lcidDirectories = Directory.GetDirectories(sourcePackagePath);
            foreach (string lcidFolder in lcidDirectories)
			{
				var templatesPath = Path.Combine(lcidFolder, "xrmSolutions", solutionName, "Templates");
				if (Directory.Exists(templatesPath))
				{
					int langCodeSize = 4;
					var langCode = lcidFolder.Substring(lcidFolder.Length - langCodeSize);
					//Check if the folder proccessed is of valid language code as parent folder may contains subfolders other than language code folder like folder with name "Base". Hence this check.
					if (langCode.StartsWith("10") || langCode.StartsWith("20") || langCode.StartsWith("30"))
					{

						if (File.Exists(Path.Combine(templatesPath, "EmailTemplates.xml")))
						{
							emailList.AddRange(GetTemplatesNode(Path.Combine(templatesPath, "EmailTemplates.xml"), "emailtemplate").Cast<XmlNode>().ToList());
						}
						if (File.Exists(Path.Combine(templatesPath, "MailMergeTemplates.xml")))
						{
							mailMergeList.AddRange(GetTemplatesNode(Path.Combine(templatesPath, "MailMergeTemplates.xml"), "mailmergetemplate").Cast<XmlNode>().ToList());
						}
						if (File.Exists(Path.Combine(templatesPath, "ContractTemplates.xml")))
						{
							contractList.AddRange(GetTemplatesNode(Path.Combine(templatesPath, "ContractTemplates.xml"), "contracttemplate").Cast<XmlNode>().ToList());
						}
						CopyTemplates(templatesPath, targetPath, langCode);
					}
				}
				else
				{
					Console.WriteLine("Directory doesn't exists hence skipped processing.");
				}
			}

			if (emailList.Count > 0)
			{
				AddNodesToFile(Path.Combine(targetPath, "EmailTemplates.xml"), emailList, "<EmailTemplates></EmailTemplates>");
			}

			if (mailMergeList.Count > 0)
			{
				AddNodesToFile(Path.Combine(targetPath, "MailMergeTemplates.xml"), mailMergeList, "<MailMergeTemplates></MailMergeTemplates>");
			}

			if (contractList.Count > 0)
			{
				AddNodesToFile(Path.Combine(targetPath, "ContractTemplates.xml"), contractList, "<ContractTemplates></ContractTemplates>");
			}
		}

		private static void AddNodesToFile(string targetPath, List<XmlNode> nodeList, string rootNode)
		{
			if (!File.Exists(targetPath))
			{
				XmlDocument doc = new XmlDocument();
				doc.LoadXml(rootNode);

				XmlTextWriter writer = new XmlTextWriter(targetPath, null);
				writer.Formatting = Formatting.Indented;
				doc.Save(writer);
				writer.Flush();
				writer.Close();
			}

			XmlDocument mergedDoc = new XmlDocument();
			mergedDoc.Load(targetPath);

			foreach (XmlNode node in nodeList)
			{
				XmlNode imported = mergedDoc.ImportNode(node, true);
				mergedDoc.DocumentElement.AppendChild(imported);
			}

			mergedDoc.Save(targetPath);
		}

		private static XmlNodeList GetTemplatesNode(string path, string nodeName)
		{
			string xmlFile = File.ReadAllText(path);
			XmlDocument xmldoc = new XmlDocument();
			xmldoc.LoadXml(xmlFile);

			return xmldoc.GetElementsByTagName(nodeName);
		}

		private static void CopyTemplates(string sourcePath, string targetPath, string langCode)
		{
			if (!Directory.Exists(targetPath))
			{
				Directory.CreateDirectory(targetPath);
			}

			string[] sourceDirectories = Directory.GetDirectories(sourcePath, "*", SearchOption.AllDirectories);

			foreach (string dirPath in sourceDirectories)
			{
				Directory.CreateDirectory(dirPath.Replace(sourcePath, targetPath));
			}

			//Copy all the files & Replaces any files with the same name
			foreach (string newPath in Directory.GetFiles(sourcePath, "*.*", SearchOption.AllDirectories))
			{
				if (newPath.Contains("EmailTemplates.xml") || newPath.Contains("MailMergeTemplates.xml") || newPath.Contains("ContractTemplates.xml"))
				{
					continue;
				}
				else
				{
					File.Copy(newPath, newPath.Replace(sourcePath, targetPath), true);
				}
			}
		}
	}
}
