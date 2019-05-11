document.addEventListener("DOMContentLoaded", function() {
	
	/* TODO LIST */

	// display todo list
	function getTodoList()
	{
		var list = ""; // list of tasks
		btn = []; // reset btn array
		
		for(var i = 0; i < todos.length; i++)
		{
			var todo = todos[i];
				date = todo.date;
				name = todo.name;
				task = todo.todo;
				done = todo.done;

				list += "<li class='list-group-item "+done+"'>["+date+"] - "+name+" : "+task+" <span class='delete-done btn-group btn-group-sm' role='group'><button class='clearOne btn btn-dark' data-index='"+i+"'><span class='oi oi-delete'></span></button> <button class='doneOne btn btn-dark' data-index='"+i+"'><span class='oi oi-check'></span></button></span></li>";
			
			btn.push(name); // add btns in btns array
		}
		mylist.innerHTML = list;

		save(); // store changements in localStorage
		getClearBtns(); // display clear btns

		// preparation to clear the task
		getClearActions();
	}

	// prepare todo obj
	function Todo(date, name, todo) 
	{
		this.date = date;
		this.name = name;
		this.todo = todo;
		this.done = false;
	}

	// add a new task to todo list
	function addNewTodo(date, name, todo)
	{
		var todo = new Todo(date, name, todo); // create a new todo Obj
		todos.push(todo); // put todo obj in tab todos[]
	}

	// remove a specific task
	function removeTodo(index)
	{
		todos.splice(index, 1); // remove a task from tab todos[]
		getTodoList(); // show the list 
	}

	// check a task
	function checkTodo(index)
	{
		todos[index].done = true; // line-through a done class
	 	getTodoList(); // show the list
	}

	// do a unique array
	function onlyUnique(value, index, self) 
	{ 
	    return self.indexOf(value) === index;
	}

	// alternative to onclick=""
	function getClearActions() 
	{
		var clearOne = document.querySelectorAll('.clearOne');
		var doneOne = document.querySelectorAll('.doneOne');
		var clearNames = document.querySelectorAll('.clearByName');

		clearNames.forEach(btn => 
			btn.addEventListener('click', function() {
				var data = btn.dataset.name;
				console.log(data)
				console.log(btn);
				clearByName(data);
			})
		);

		clearOne.forEach(btn => 
			btn.addEventListener('click', function() {
				var data = btn.dataset.index;
				removeTodo(data);
			})
		);

		doneOne.forEach(btn => 
			btn.addEventListener('click', function() {
				var data = btn.dataset.index;
				checkTodo(data);
			})
		);
	}

	// display btns to clear by names
	function getClearBtns()
	{	
		var btnUnique = btn.filter(onlyUnique);
		var mybtns = "";
		for(var i = 0; i < btnUnique.length; i++)
		{
			mybtns += "<button class='clearByName btn btn-dark btn-sm' data-name='"+btnUnique[i]+"'>Clear "+btnUnique[i]+" tasks</button> "
		}
		btns.innerHTML = mybtns;
	}

	// to clear by names
	function clearByName(name)
	{
		var i = todos.length;

		while(i--)
		{
			if(name == todos[i].name)
			{
				todos.splice(i, 1);
			}
		}

		getTodoList(); // show the list
	}

	// clear all list
	function clearAll()
	{
		todos = []; // reset the todos[] array
		getTodoList(); // show the list
	}

	// save in localStorage
	function save()
	{
		window.localStorage.setItem("todos", JSON.stringify(todos));	
	}

	/*
		--- MAIN SCRIPT ---
	*/
	var myForm = document.forms['addTask']; 
	var mylist = document.querySelector('#mylist'); // todos tasks will be shown in this ul
	var btns   = document.querySelector('#btns'); // clear btns by names will be shown in this <div>
	var clear  = document.querySelector('#clearall'); // clear all btn

	var todos = [];
	var storedTodos = JSON.parse(window.localStorage.getItem("todos"));
	if(storedTodos != null)
	{
		for(var i = 0; i < storedTodos.length; i++)
		{
			todos.push(storedTodos[i])
		}
	}
	var btn = [];

	getTodoList(); // show the list

	myForm.addEventListener('submit', function(e){
		
		e.preventDefault();

		var date = myForm['date'].value;
		var todo = myForm['todo'].value;
		var name = myForm['name'].value;

		if(date != "" || todo != "" || name != "")
		{
			addNewTodo(date, name, todo); // add a new task in todo tab
			getTodoList(); // show the list
		}
	})

	clear.addEventListener('click', clearAll) // call the func clearAll() to clear todo list


	// AJAX VELIB INFOS
	document.querySelector("#getVelib").addEventListener("click", function() {

		var data = "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=station_id%3D37791&rows=1";
		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {

			if(request.readyState == 4) 
			{
				var jsonObj = JSON.parse(request.responseText);

				//console.log(jsonObj.records[0].fields);
				var stationName = jsonObj.records[0].fields.name
				var capacity    = jsonObj.records[0].fields.capacity
				var available   = jsonObj.records[0].fields.numbikesavailable

				swal("Available Velib : "+available, stationName+" : "+available+"/"+capacity);
			}
		
		} 

		request.open("GET", data, true);
	   	request.send();

	});

});