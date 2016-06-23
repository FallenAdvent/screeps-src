/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('controllers.masterController');
 * mod.thing == 'a thing'; // true
 */

var RoomConfig = require('data.RoomConfig');
var BirthController = require('controllers.BirthController');
var HarvesterController = require('controllers.HarvesterController');
var BuilderController = require('controllers.BuilderController');
var ResourceController = require('controllers.ResourceController');
var MaintenanceController = require('controllers.MaintenanceController');

var RoomController =
{
    Controllers: [ResourceController, BirthController, MaintenanceController, BuilderController, HarvesterController],
    Config: RoomConfig,
    Room: null,
    Tick: function ()
    {
        if(this.Room != null)
        {
            var RoomControllerData = Memory.MyRooms[this.Room.name];
            //Load in the rooms config settings
            this.Config.HarvestDroneMax = RoomControllerData.Config.HarvestDroneMax;
            this.Config.BuilderDroneMax = RoomControllerData.Config.BuilderDroneMax;
            this.Config.MaintenanceDroneMax = RoomControllerData.Config.MaintenanceDroneMax;

            for (var i in this.Controllers) {
                this.Controllers[i].LoadMem(RoomControllerData);
            }

            for (var i in this.Controllers) {
                this.Controllers[i].Manage(this);
            }

            for (var i in this.Controllers) {
                this.Controllers[i].SaveMem(RoomControllerData);
            }
        }
    },
    SetupRoomData: function(Room)
    {
        Memory.MyRooms[Room.name] = {};
        var RoomControllerData = Memory.MyRooms[Room.name];
        RoomControllerData.Config = {};
        RoomControllerData.Config.HarvestDroneMax = this.Config.HarvestDroneMax;
        RoomControllerData.Config.BuilderDroneMax = this.Config.BuilderDroneMax;
        RoomControllerData.Config.MaintenanceDroneMax = this.Config.MaintenanceDroneMax;
        //Doing a save like this will give everything its default values
        for (var i in this.Controllers)
        {
            RoomControllerData[this.Controllers[i].Name] = {};
            this.Controllers[i].SaveMem(RoomControllerData);
        }
    },
    GetController: function(ControllerName)
    {
        for(var i in this.Controllers)
        {
            if(this.Controllers[i].Name == ControllerName)
            {
                return this.Controllers[i];
            }
        }
    }
};

module.exports = RoomController;