﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
namespace StShop.UI.ViewModels
{
    public class RegisterModel
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public Address Address { get; set; }
        public string Password { get; set; }
    }
}