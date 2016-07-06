var money = 0;
var click_inc = 1;
var timed_inc = 0;
idle_timer = null;
var shop_items = [];

/**
*	Initializes the game with items in the shop, timers and click event listeners.
*/
function playGame(/*itemSet*/){
	promptDialog();
	
	idle_timer = setInterval(function(){money += timed_inc; updateMoney(money);},5000);
	$(".game").click(function(e) {
		money += click_inc;
		updateMoney(money);
		
		displayClickInc(e);
	});

	/*for(var i = 0; i < shop_items.length; i++){
		display_item(shop_items[i]);
	}
	checkPurchasable();*/
}

/**
*	Updates the balance displayed.
*	@param amount Amount to display.
*/
function updateMoney(amount){
	$("#balance").html(valueDisplay(amount));
	checkPurchasable();
}

/**
*	Checks the player's balance and displays accordingly.
*	@param amount Amount to check.
*/
function valueDisplay(amount){
	var toDisplay;
	if(amount >= 1000000000){ //Billion check
		toDisplay = (amount / 1000000000).toFixed(2);
		return toDisplay + "B";
	}
	if(amount >= 1000000){ //Million check
		toDisplay = (amount / 1000000).toFixed(2);
		return toDisplay + "M";
	}
	return amount;
}

/**
*	Adds an item to the shop.
*	@param i_name Name of the item.
*	@param i_type Type of the item. (click or idle)
*	@param i_cost Initial cost of the item.
*	@param i_inc Initial increment increase of the item.
*/
function addItem(i_name, i_type, i_cost, i_inc){
	var item = {
		name: i_name.replace(/[\s]/g,""),
		type: i_type,
		cost: i_cost,
		inc: i_inc,
		amt: 0
	};
	
	shop_items.push(item);
}

/**
*	Displays an item in the shop tab.
*	@param i_item Item to display.
*/
function display_item(i_item){
	var name = i_item.name;
	var type = i_item.type;
	var cost = i_item.cost;
	var inc = i_item.inc;
	var amt = i_item.amt;
	var textnode;
	
	var obj = document.createElement("div");
	obj.setAttribute("class","purchasable");
	obj.setAttribute("id",name);
	
	var a = document.createElement("span");
	a.setAttribute("class","itemName");
	textnode = document.createTextNode(name.replace(/([A-Z])/g, ' $1').trim());
	a.appendChild(textnode);
	
	/*var b = document.createElement("span");
	b.setAttribute("class","itemType");
	textnode = document.createTextNode(type);
	b.appendChild(textnode);*/
	
	var c = document.createElement("span");
	c.setAttribute("class","itemCost");
	textnode = document.createTextNode("$"+cost);
	c.appendChild(textnode);
	
	var d = document.createElement("span");
	d.setAttribute("class","itemInc");
	if(type === "click"){	
		textnode = document.createTextNode("+ $"+inc+" / click");
	}
	if(type === "idle"){
		textnode = document.createTextNode("+ $"+inc+" / 5 sec");
	}
	d.appendChild(textnode);
	
	var e = document.createElement("span");
	e.setAttribute("class","itemAmt");
	textnode = document.createTextNode("Owned: "+amt);
	e.appendChild(textnode);
	
	obj.appendChild(a);
	//obj.appendChild(b);
	obj.appendChild(c);
	obj.appendChild(d);
	obj.appendChild(e);
	
	$(".purchase").append(obj);
	
	$("#"+name).click(function() {
		if(money > cost){
			money -= cost;
			i_item.amt++;
			updateItemCost(name);
			$(this).children(".itemAmt").html("Owned: " + i_item.amt);
			$("#chaching").trigger('play');
			
			if(type === "click"){
				click_inc += inc;
			}
			if(type === "idle"){
				timed_inc += inc;
			}
		} else {
			$("#nope").trigger('play');
		}
		updateMoney(money);
	});
}

/**
*	Searches the shop array for an item using the name of the item as a key.
*	@param nameKey Name of the item to search for.
*/
function search(nameKey){
	for(var i = 0; i < shop_items.length; i++){
		if(shop_items[i].name === nameKey){
			return shop_items[i];
		}
	}
	return false;
}

/**
*	Changes the color of the cost of an item in the shop. Red if not enough,
*	Green if enough money to purchase.
*/
function checkPurchasable(){
	for(var i = 0; i < shop_items.length; i++){
		if(shop_items[i].cost > money){
			$("#"+shop_items[i].name).children(".itemCost").css("color","red");
		} else {
			$("#"+shop_items[i].name).children(".itemCost").css("color","green");
		}
	}
}

/**
*	Updates the cost of the item if it is purchased.
*	@param item_name Name of the item to update price.
*/
function updateItemCost(item_name){
	var item = search(item_name);
	if(item != false){
		//Item cost scaling
		item.cost = item.cost * 2;
		$("#"+item_name).children(".itemCost").html("$"+item.cost);
	}
}

/**
*	Displays the click increment amount when the game is clicked on.
*	@param e Event that happened.
*/
function displayClickInc(e){
	var pop = document.createElement("span");
	var offset = $(".game").offset();
	var xCoord = e.pageX - offset.left;
	var yCoord = e.pageY - offset.top;
	pop.setAttribute("class","pop");
	var textnode = document.createTextNode("+"+click_inc);
	pop.appendChild(textnode);
	$(".game").append(pop);
	$(".pop").css("position","absolute");
	$(".pop").css("left",xCoord + "px");
	$(".pop").css("top",yCoord + "px");
	$(".pop").animate({
		"top": "-=80px",
		"opacity": 0.4
	}, 100 , function(){$(".pop").remove();} );
}

/*$(".game").on("mousemove", function(e){
	$("#log").text("pageX: " + (e.pageX - $(".game").offset().left) + ", pageY: " + (e.pageY - $(".game").offset().top));
});*/

function mySummerSet(){
	$("#gameImage").attr("src","pic/summer.jpg");
	$("#gameImage").attr("alt","summer");
	addItem("Gambling Addiction", "click", 10, 1);
	addItem("Bridges Restaurant Burger", "click", 50, 3);
	addItem("Ultimate Tryout", "click", 100, 5);
	addItem("Avengers Age Of Ultron", "idle", 200, 5);
	addItem("Vodka Strawberry Shots", "click", 250, 10);
	addItem("Mad Max", "idle", 300, 10);
	addItem("Jurrasic World", "idle", 600, 20);
	addItem("Kits Beach", "click", 850, 20);
	addItem("E-exit Room", "click", 1000, 40);
	addItem("Hike Up The Chief", "click", 2500, 80);
	addItem("Sharknado", "idle", 4000, 100);
	addItem("Canada Day", "click", 7000, 150);
	addItem("Hermit Hut Sitting", "click", 9000, 200);
	addItem("Watch Downtown Fireworks", "idle", 10000, 300);
	addItem("Hermit Hut Reconstruction", "click", 120000, 300);
	addItem("People Sandwich Talk", "click", 150000, 500);
	addItem("Walk With The Dragon", "click", 300000, 700);
	addItem("Bowling 150", "click", 500000, 800);
	addItem("Lynn Canyon Park", "click", 750000, 1000);
	addItem("Jump Off A Cliff", "click", 1000000, 1300);
	addItem("3 Beer", "click", 5000000, 3);
}

function standardSet(){
	$("#gameImage").attr("src","pic/click.jpg");
	$("#gameImage").attr("alt","click");
	addItem("Razer Mouse", "click", 15, 1);
	addItem("Mouse Script", "idle", 50, 2);
	addItem("Keyboard Bindings", "click", 100, 5);
	addItem("Touch Screen", "click", 250, 7);
	addItem("Mechanical Keyboard", "click", 500, 10);
	addItem("Aim Bot", "idle", 1000, 10);
	addItem("StarCraft Mechanics", "click", 5000, 15);
	addItem("Button Masher", "click", 20000, 20);
	addItem("What Am I Doing", "click", 100000, 35);
	addItem("Hacker", "click", 500000, 50);
	addItem("Faker Level", "click", 1000000, 100);
}

function promptDialog(){
	$("#dialog").html("Please choose an item set");
	$("#dialog").dialog({
		title: "Which item set would you like?",
		dialogClass: "no-close",
		modal: true,
		closeOnEscape: false,
		resizable: false,
		draggable: false,
		autoOpen: true,
		buttons: {
			"Standard Set": function(){
				standardSet();
				for(var i = 0; i < shop_items.length; i++){
					display_item(shop_items[i]);
				}
				checkPurchasable();
				$(this).dialog("close");
			},
			
			"Summer Set": function(){
				mySummerSet();
				for(var i = 0; i < shop_items.length; i++){
					display_item(shop_items[i]);
				}
				checkPurchasable();
				$(this).dialog("close");
			}
		}
	});
	
}