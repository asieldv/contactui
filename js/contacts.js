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
                this.addEvent("search", "keyup", function(evt){
                    if(evt.key === 'Enter')
                        UI.search(UI.getById("search").value);
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
                    UI.hideLoading();
                    
                });
            },
            addContact: function (response, error) {
                this.hide("register-form");
                this.show("inserting");
                this.ajax.add((response, error) =>{
                    if(error)
                        console.log(error)
                    UI.hide("inserting");
                    UI.show("register-form");
                });
            },
            search: function(searchString) {
                var names = [];
                var phones = [];
                var dates = [];
                var address = UI.validators.extractAddress(searchString);
                if(address != null) {
                    searchString = searchString.replace('\"' + address + '\"',"");
                }
                searchString.split(" ").forEach(param => {
                    if(UI.validators.isDate(param) && params != "")
                        dates.push(param)
                    else if(UI.validators.isPhoneNumber(param) && param != "")
                        phones.push(param)
                    else if(param != '')
                        names.push(param);
                });
                console.log("names ", names);
                console.log("phones ", phones);
                console.log("dates ", dates);
                console.log("address ", address);
                this.ajax.search(names[0], address, (res, err) => {
                    if(error) 
                        console.error(error)
                    else
                        res.forEach(e => UI.addDataLine(e));
                });
            },
            ajax: {
                get: async function (cb) {
                    const url = "http://localhost:8080/contact/findall";
                    fetch(url)
                        .then(res => res.json())
                        .then(json => cb(json, null))
                        .catch(error => cb(null, error));
                },
                search: function(firstName, address, cb) {
                    const url = "http://localhost:8080/contact/findbynameandaddress?firstName=" + firstName + "$address=" + address;
                    fetch(url)
                        .then(res => res.json())
                        .then(json => cb(json, null))
                        .catch(error => cb(null, error));
                },
                add: async function (cb) {
                    const url = "htttp://localhost:8080/contact/addcontact";
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
                    var data = {
                        firstName: firstName,
                        secondName: secondName,
                        address: address,
                        dateOfBirth: dateOfBirth,
                        phoneNumber: phoneNumber,
                        photo: photo
                    }
                    // Default options are marked with *
                    fetch(url, {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        mode: "cors", // no-cors, *cors, same-origin
                        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: "same-origin", // include, *same-origin, omit
                        headers: {
                            "Content-Type": "application/json",
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: "follow", // manual, *follow, error
                        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                        body: JSON.stringify(data), // body data type must match "Content-Type" header
                    })
                        .then(response => response.json())
                        .then(json => {
                            UI.cleanForm();
                            cb(json, null)
                        })
                        .catch(error => cb(null, error));
                },
            },
            validators: {
                isDate: function(dt) {
                    var isGoodDate = new RegExp("^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$");
                    return isGoodDate.test(dt);
                },
                isPhoneNumber(nmbr) {
                    var isGooPhoneNumber = new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$");
                    return isGooPhoneNumber.test(nmbr);
                },
                extractAddress(str){
                    const matches = str.match(/"(.*?)"/);
                    return matches ? matches[1] : null;
                }
            }
        });
    }

    var api = init();
    api.init();
    return api;
})));
