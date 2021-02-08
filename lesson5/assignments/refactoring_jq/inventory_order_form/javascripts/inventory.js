// could replace 'var' w/ 'let' or 'const' also ...
var inventory;

(function() {
  inventory = {
    lastId: 0,
    collection: [],
    setDate: function() {
      var date = new Date();
      // $("#order_date").text(date.toUTCString());
      document.getElementById("order_date").textContent = date.toUTCString();
    },
    cacheTemplate: function() {
      // var $iTmpl = $("#inventory_item").remove();
      const inventoryItem = document.getElementById("inventory_item");
      const iTmpl = inventoryItem.parentNode.removeChild(inventory_item);
      // this.template = $iTmpl.html();
      // this.template = iTmpl.innerHTML; // no Handlebars
      this.template = Handlebars.compile(iTmpl.innerHTML); // Handlebars
      // console.log(iTmpl.innerHTML);
    },
    add: function() {
      this.lastId++;
      let item = {
        id: this.lastId,
        name: "",
        stock_number: "",
        quantity: 1,
      };

      this.collection.push(item);
      return item;
    },
    remove: function(idx) {
      this.collection = this.collection.filter(function(item) {
        return item.id !== idx;
      });
    },
    get: function(id) {
      var found_item;

      this.collection.forEach(function(item) {
        if (item.id === id) {
          found_item = item;
          return false; // 'return' has no effect w/i a forEach loop ...
        }
      });

      return found_item;
    },
    // update: function($item) {
    update: function(itemElem) {
      // var id = this.findID($item),
      //     item = this.get(id);
      let id = this.findID(itemElem);
      let item = this.get(id);

      // item.name = $item.find("[name^=item_name]").val();
      item.name = itemElem.querySelector("[name^=item_name]").value;
      // item.stock_number = $item.find("[name^=item_stock_number]").val();
      item.stock_number = itemElem.querySelector("[name^=item_stock_number]").value;
      // item.quantity = $item.find("[name^=item_quantity]").val();
      item.quantity = itemElem.querySelector("[name^=item_quantity]").value;
    },
    newItem: function(e) {
      e.preventDefault();
      // var item = this.add(),
      //     $item = $(this.template.replace(/ID/g, item.id));
      let item = this.add();
      const tr = document.createElement('tr');
      // tr.innerHTML = this.template.replace(/ID/g, item.id); // no Handlebars
      tr.innerHTML = this.template(item); // Handlebars

      // $("#inventory").append($item);
      document.getElementById("inventory").appendChild(tr);
    },
    findParent: function(e) {
      // return $(e.target).closest("tr");
      // let elem = e.target;
      // while (elem.nodeName.toLowerCase() !== "tr") elem = elem.parentNode;
      // return elem;
      return e.target.closest("tr");
    },
    // findID: function($item) {
    findID: function(itemElem) {
      // return +$item.find("input[type=hidden]").val();
      return Number(itemElem.querySelector("input[type=hidden]").value)
    },
    deleteItem: function(e) {
      e.preventDefault();
      // var $item = this.findParent(e).remove();
      let childToRemove = this.findParent(e);
      let itemElem = childToRemove.parentNode.removeChild(childToRemove);

      // this.remove(this.findID($item));
      this.remove(this.findID(itemElem));
    },
    updateItem: function(e) {
      // var $item = this.findParent(e);
      let itemElem = this.findParent(e);
      // this.update($item);
      this.update(itemElem);
    },
    bindEvents: function() {
      // Note: $.proxy(fn, context); <=> fn.bind(context);
      let self = this;
      const inventoryElem = document.getElementById("inventory");

      // $("#add_item").on("click", $.proxy(this.newItem, this));
      document.querySelector("#add_item").addEventListener('click', this.newItem.bind(this));

      // $("#inventory").on("click", "a.delete", $.proxy(this.deleteItem, this));
      inventoryElem.addEventListener("click", function(e) {
        for (var target = e.target; target && target !== this; target = target.parentNode) {
          if (target.matches("a.delete")) {
            self.deleteItem.bind(self).call(target, e);
            break;
          }
        }
      });
      // inventoryElem.addEventListener('click', this.deleteItem.bind(this));

      // $("#inventory").on("blur", ":input", $.proxy(this.updateItem, this));
      inventoryElem.addEventListener('focusout', this.updateItem.bind(this));
    },
    init: function() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    }
  };
})();

// $($.proxy(inventory.init, inventory);
// $(inventory.init.bind(inventory)); // i.e. '$(function() {})' aka '$(document).ready(function() {})'
document.addEventListener('DOMContentLoaded', inventory.init.bind(inventory));
