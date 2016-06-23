

var RoomController = require('controllers.RoomController');

module.exports.loop = function ()
{
    if(Memory.MyRooms == null)
    {
        Memory.MyRooms = {};
    }
    
    var MyRooms = Memory.MyRooms;
    
    for(var roomName in Game.rooms)
    {
        var room = Game.rooms[roomName];
        //Is this a new room we need to add to our set
        if(MyRooms[room.name] == null)
        {
            Memory.MyRooms[room.name] = [];
            var RoomControllerData = Memory.MyRooms[room.name];
            RoomController.SetupRoomData(room);
        }
        else
        {
            for(var roomName in Game.rooms)
            {
                RoomController.Room = Game.rooms[roomName];
                RoomController.Tick();
            }
        }
    }
    
    
}