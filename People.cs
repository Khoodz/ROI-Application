using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace backendMobile
{
    public class People
    {
        public int id { get; set; }
        public string name { get; set; }
        public category category { get; set; }
        public string number { get; set; }
        public Address Address { get; set; }
    }
}
