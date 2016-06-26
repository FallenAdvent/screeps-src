/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('controllers.masterController');
 * mod.thing == 'a thing'; // true
 */

var MaintenanceDrone = require('drones.Maintenance')

var MaintenanceController =
{
    Name: "MaintenanceController",
    Drones: [],
    DroneCount: 0,
    DesiredDones: 2,
    BirthRequestMade: false,
    CreepSettings: [WORK, CARRY, CARRY, MOVE, MOVE],
    LoadMem: function (RoomControllerData)
    {
        this.Drones = RoomControllerData[this.Name].Drones;
        this.DroneCount = RoomControllerData[this.Name].DroneCount;
        this.BirthRequestMade = RoomControllerData[this.Name].BirthRequestMade;
        this.DesiredDones = RoomControllerData.Config.MaintenanceDroneMax;
    },
    SaveMem: function (RoomControllerData)
    {
        RoomControllerData[this.Name].Drones = this.Drones;
        RoomControllerData[this.Name].DroneCount = this.DroneCount;
        RoomControllerData[this.Name].BirthRequestMade = this.BirthRequestMade;
    },
    Manage: function (RoomController)
    {
        this.RoomController = RoomController;
        //Check if we have already made a request for a new drone if not do we need to request any new ones
        if (this.BirthRequestMade == false && this.DroneCount < this.DesiredDones)
        {
            RoomController.GetController("BirthController").RequestBirth(this);
        }

        if (this.Drones.length != 0)
        {
            for (var i in this.Drones)
            {
                var droneName = this.Drones[i];
                var drone = Game.creeps[droneName];
                if (drone != null && drone.spawning == false)
                {
                    //Check the drones time left and see if its is going to retire soon
                    if (drone.ticksToLive < 50)
                    {
                        RoomController.GetController("BirthController").RequestRetiring(this, drone);
                    }

                    //Do the task the drone is assigned too
                    MaintenanceDrone.DoTask(this, drone);
                }
            }
        }
    },
    GetCreepSettings: function (AvailableCost) {
        if (AvailableCost >= 700) {
            return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        }

        if (AvailableCost >= 500) {
            return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        }

        if (AvailableCost < 400 && AvailableCost > 300) {
            return [WORK, CARRY, CARRY, MOVE, MOVE];
        }

        return null;
    }
};

module.exports = MaintenanceController;
