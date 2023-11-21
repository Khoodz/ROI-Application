using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.IO;
using System.Net;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Xml.Linq;

namespace backendMobile
{
    /// <summary>
    /// Summary description for backendMobile
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class backendMobile : System.Web.Services.WebService
    {
        // Get Employees from the People.xml file
        [WebMethod(Description = "Get Employees"), ScriptMethod(UseHttpGet = true)]
        public void GetEmployees()
        {
            var file = Path.Combine(HttpRuntime.AppDomainAppPath, "People.xml");
            var doc = XDocument.Load(file);

            // Convert XML elements to a list of People objects
            var staff = doc.Root.Elements().Select(e => new People
            {
                id = (int)e.Attribute("id"),
                name = e.Element("name").Value,
                category = Categories.FirstOrDefault(c => c.Id == int.Parse(e.Element("category").Value)),
                number = e.Element("number").Value,
                Address = new Address
                {
                    street = e.Element("address")?.Element("street")?.Value ?? "",
                    city = e.Element("address")?.Element("city")?.Value ?? "",
                    state = e.Element("address")?.Element("state")?.Value ?? "",
                    ZIP = e.Element("address")?.Element("ZIP")?.Value ?? "",
                    country = e.Element("address")?.Element("country")?.Value ?? ""
                }
            }).ToList();

            // Return the serialized list of People objects
            Context.Response.Write(new JavaScriptSerializer().Serialize(staff));
        }

        // Add a new person to the People.xml file
        [WebMethod(Description = "Add staff"), ScriptMethod(UseHttpGet = true)]
        public void AddStaff(string name, string category, string number, string street, string city,
            string state, string ZIP, string country)
        {
            var file = Path.Combine(HttpRuntime.AppDomainAppPath, "People.xml");
            var doc = XDocument.Load(file);
            var root = doc.Root;

            // Generate a new unique id for the person
            int id = root.Elements().Max(p => (int)p.Attribute("id")) + 1;

            // Create XML elements for the new person and address
            var Employee = new XElement("person");
            Employee.Add(new XAttribute("id", id));
            Employee.Add(new XElement("name", name));
            Employee.Add(new XElement("category", category));
            Employee.Add(new XElement("number", number));

            var Address = new XElement("address");
            Address.Add(new XElement("street", street));
            Address.Add(new XElement("city", city));
            Address.Add(new XElement("state", state));
            Address.Add(new XElement("ZIP", ZIP));
            Address.Add(new XElement("country", country));
            Employee.Add(Address);

            // Add the new person to the XML document
            root.Add(Employee);
            doc.Save(file);
            Context.Response.Write($"{name} has been added!");
        }

        // Delete a person from the People.xml file
        [WebMethod, ScriptMethod(UseHttpGet = true)]
        public void DeletePeople(int id)
        {
            var file = Path.Combine(HttpRuntime.AppDomainAppPath, "People.xml");
            var doc = XDocument.Load(file);

            // Find the person by id and remove them from the XML document
            var person = doc.Root.Elements().FirstOrDefault(p => (int)p.Attribute("id") == id);

            if (person != null)
            {
                person.Remove();
                doc.Save(file);
                Context.Response.Write($"ID {id} has been deleted!");
            }
        }

        // Update information for a specific employee in the People.xml file
        [WebMethod(Description = "Update Employee"), ScriptMethod(UseHttpGet = true)]
        public void UpdateEmployee(int id, string name, string category, string number, string street, string city, string state, string ZIP, string country)
        {
            var file = Path.Combine(HttpRuntime.AppDomainAppPath, "People.xml");
            var doc = XDocument.Load(file);
            var employee = doc.Root.Elements().FirstOrDefault(b => int.Parse(b.Attribute("id").Value) == id);

            if (employee != null)
            {
                // Update employee information in the XML document
                UpdateElementValue(employee, "name", name);
                UpdateElementValue(employee, "category", category);
                UpdateElementValue(employee, "number", number);

                var address = employee.Element("address");
                UpdateElementValue(address, "street", street);
                UpdateElementValue(address, "city", city);
                UpdateElementValue(address, "state", state);
                UpdateElementValue(address, "ZIP", ZIP);
                UpdateElementValue(address, "country", country);

                doc.Save(file);
                Context.Response.Write("Updated!");
            }
        }

        // Helper method to update the value of an XML element
        private static void UpdateElementValue(XContainer container, string elementName, string value)
        {
            var element = container.Element(elementName);
            if (element != null && !string.IsNullOrEmpty(value))
            {
                element.Value = value;
            }
        }

        // Get Categories from the Categories.xml file
        [WebMethod(Description = "Get Categories"), ScriptMethod(UseHttpGet = true)]
        public void GetCategories()
        {
            // Return the serialized list of category objects
            Context.Response.Write(new JavaScriptSerializer().Serialize(Categories));
        }

        // Property to retrieve the list of categories from the Categories.xml file
        public List<category> Categories
        {
            get
            {
                var elements =
                    XDocument.Load(Path.Combine(HttpRuntime.AppDomainAppPath, "Categories.xml")).Root.Elements();

                var categories = new List<category>();
                foreach (XElement element in elements)
                {
                    // Create category objects from XML elements
                    category categoryObj = new category
                    {
                        Id = int.Parse(element.Attribute("Id").Value),
                        Name = element.Element("Name").Value
                    };
                    categories.Add(categoryObj);
                }

                return categories;
            }
        }
    }

}

