(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (function () {
    var current = global.UI;
    var exports = global.UI = factory();
    exports.noConflict = function () { global.Cart = current; return exports; };
  }()));
}(this, (function () { 'use strict';
    function init() {
        return Object.create({
            init: function(){
                //this.toggle("add-section");
                this.addEvent("add-btn", "click", function(){
                    UI.hide("list-section");
                    UI.show("add-section");
                });
                this.addEvent("list-btn", "click", function() {
                    UI.hide("add-section");
                    UI.show("list-section");
                    UI.loadData();
                });
                this.addEvent("add-contact", "click", function () {
                    UI.addContact();
                });
                this.loadData();
            },
            getById: function(id) {
               var elm = document.getElementById(id);
                return elm;
            },
            toggle : function(id) {
                var x = this.getById(id);
                if (x.style.display === "none") {
                    x.style.display = "block";
                } else {
                    x.style.display = "none";
                }
            },
            show: function(id) {
                var x = this.getById(id);
                x.style.display = "block" ;
            },
            hide: function(id) {
                var x = this.getById(id);
                x.style.display = "none";
            },
            addEvent : function(elementId, eventName, callback) {
                var elm =this.getById(elementId);
                elm.addEventListener(eventName,  callback);
            },
            validateData: function(firstName, secondName, address, phoneNumber, dateOfBirth, personalPhoto) {
                return true;
            },
            addDataLine: function(data) {
                this.getById("data-panel").innerHTML += this.template(data);
            },
            clearData: function() {
               var elm = this.getById("data-panel") ;
                elm.innerText = "";
            },
            showLoading : function() {
                this.hide("data-panel");
                this.show("loading");
            },
            hideLoading: function() {
                this.hide("loading");
                this.show("data-panel");
            },
            stringToElements: function(htmlString) {
                var template = document.createElement('template');
                template.innerHTML = htmlString;
                return template.content.childNodes;
            },
            template: function( data ){
                var tmpl = `<div class="card">
                    <div class="row">
                        <div class="col c8">
                            <img src="%photo%" />
                        </div>
                        <div class="col c4">
                            <div class="row row-data text-small">%firstName%</div>
                            <div class="row row-data text-small">%secondName%</div>
                            <div class="row row-data text-small">%address%</div>
                            <div class="row row-data text-small">%dateOfBirth%</div>
                            <div class="row row-data text-small">%phoneNumber%</div>
                        </div>
                    </div>
                </div>`;

                return tmpl.replace(/%(\w*)%/g, function( m, key ){
                    return data.hasOwnProperty( key ) ? data[ key ] : "";
                });
            },
            cleanForm: function() {
                document.getElementById("firstname").value = "";
	            document.getElementById("secondname").value = "";
	            document.getElementById("address").value = "";
	            document.getElementById("dateofbirth").value = "";
	            document.getElementById("phonenumber").value = "";
	            document.getElementById("photo").value = "";

            },
            loadData: function (response, error) {
                this.showLoading();
                this.clearData();
                this.ajax.get((response, error) =>{
                    if(error)
                        console.log(error)
                    else 
                        response.forEach(e => UI.addDataLine(e));
                    console.log(response);
                    UI.hideLoading();
                    
                });
            },
            addContact: function (response, error) {
                this.hide("register-form");
                this.show("inserting");
                this.ajax.post((response, error) =>{
                    if(error)
                        console.log(error)
                    UI.hide("inserting");
                    UI.show("register-form");
                });
            },
            ajax: {
                get: async function (cb) {
                    const url = "http://localhost:8080/contact/findall";
                    fetch(url)
                        .then(res => {
                            console.log(res);
                            var data = res.json();
                            return data;
                        })
                        .then(json => cb(json, null))
                        .catch(error => cb(null, error));
                },
                post: async function (cb) {
                    // Get data from form
	                const firstName = document.getElementById("firstname").value;
	                const secondName = document.getElementById("secondname").value;
	                const address = document.getElementById("address").value;
	                const dateOfBirth = document.getElementById("dateofbirth").value;
	                const phoneNumber = document.getElementById("phonenumber").value;
	                const personalPhoto = document.getElementById("photo").value;
                    if(!UI.validateData(firstName, secondName, address, phoneNumber, dateOfBirth, personalPhoto))
                    {
                        cb(null, new Error("Error validating data"));
                    }
                    UI.data.push({
                        photo: personalPhoto,
                        firstName: firstName,
                        secondName: secondName,
                        dateOfBirth: dateOfBirth,
                        phoneNumber: phoneNumber,
                        address: address
                    });
                    UI.cleanForm();
                    setTimeout(() => {
                         cb();
                    }, 2000);
                }
            },
            data: [
                { photo: 'images/avatar.png', firstName: 'Cuco', secondName: 'Pablo', dateOfBirth: '2000/00/01', phoneNumber: '(00)123456', address: 'homeless'},
                { photo: 'images/avatar.png', firstName: 'Jose', secondName: 'antonio', dateOfBirth: '0000/123/23', phoneNumber: '(88)123456', address: 'Somewhere'},
            ]
        });
    }

    var api = init();
    api.init();
    return api;
})));
