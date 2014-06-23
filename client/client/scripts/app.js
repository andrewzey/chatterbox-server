
var app = {
  //INIT & AJAX METHODS
  init: function(){
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    app.fetch(app.enterRoom);
    setInterval(function(){
      app.fetch(app.enterRoom);
    }, 1000);
  },

  send: function(message){
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('Message with ID of ' + data.objectId + ' was sucessfully sent');
      },
      error: function(data) {
        console.log('Message sending failed');
      }
    });
  },

  fetch: function(callback){
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {order: '-createdAt'},
      success: function(data) {
        callback(data.results);
      }
    });
  },

  currentRoom: null,

  //MESSAGES FUNCTIONS
  handleSubmit: function(){
    var $text = $('.compose-chat').val();
    var user = window.location.href.slice(window.location.href.indexOf('=') + 1).split('&')[0];
    var roomURI = window.location.href.slice(window.location.href.indexOf('=') + 1).split('&')[1];
    var room = roomURI ? roomURI.split('=')[1] : 'default';
    location.href.replace(/(room=)[^\&]+/, 'room=' + room);
    var message = {
      'username': user,
      'text': $text,
      'roomname': room
    };
    app.send(message);
  },

  clearMessages: function() {
    $('#chats').html('');
  },

  addMessage: function(message) {
    $('<div class="chat">').text( message.username + ': ' + message.text ).appendTo('#chats');
  },

  addMessages: function(messageArr){
    for(var i = 0; i < messageArr.length; i++){
      app.addMessage(messageArr[i]);
    }
  },


  //ROOM FUNCTIONS
  clearRooms: function(){
    $('#roomSelect').html('');
  },

  addRoom: function(room){
    // $('#roomSelect').append('<li><a href="" class="room"></a></li>').append('a').text(room);
    var $link = $('<a href="" class="room">').text(room);
    $('#roomSelect').append('<li>').append($link);
  },

  addRooms: function(messagesArr){
    var rooms = _.uniq(_.pluck(messagesArr, 'roomname'));

    for(var i = 0; i < rooms.length; i++){
      if(rooms[i]){
        app.addRoom(rooms[i]);
      }
    }
  },

  enterRoom: function(messageArr) {
    if (app.currentRoom === null) {
      app.clearMessages();
      app.clearRooms();
      app.addRooms(messageArr);
      app.addMessages(messageArr);
    } else {
      app.clearRooms();
      location.href.replace(/(room=)[^\&]+/, 'room='+ app.currentRoom);
      console.log(location.href);
      app.addRooms(messageArr);

      app.clearMessages();
      var roomMessages = [];
      //loop through messageArr, and only display the ones whose "roomname" property matches app.currentRoom
      for (var i = 0; i < messageArr.length; i++) {
        if (messageArr[i].roomname === app.currentRoom) {
          roomMessages.push(messageArr[i]);
        }
      }
      app.addMessages(roomMessages);
    }
  }
}; //end of app object

$(document).ready(function(){
  //EVENT HANDLERS

  //Send New Message
  $('#send').on('submit', function(e){
    e.preventDefault();
    e.stopPropagation();
    if (!$('.compose-chat').val()) {
      $('.compose-chat').val('We are too lazy to enter a message');
    }
    app.handleSubmit();
    $('.compose-chat').val('');
  });

  //Create New Room
  $('.new-room-form').on('submit', function(e){
    e.preventDefault();
    e.stopPropagation();
    var room = $('.new-room').val();
    if (room) {
      app.send({username: 'admin', text: 'Created New Room: ' + room, roomname: room });
    }
    $('.new-room').val('');
  });

  //Set currentRoom value and switch to that room
  $('#roomSelect').on('click', 'a', function(e){
    e.preventDefault();
    e.stopPropagation();
    app.currentRoom = $(this).text();
    app.fetch(app.enterRoom);
  });

  //GLOBAL FUNCTIONS
  app.init();

});

