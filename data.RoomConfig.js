/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('controllers.masterController');
 * mod.thing == 'a thing'; // true
 */

var RoomConfig =
{
    Name: "RoomConfig",
    HarvestDroneMax: 3,
    BuilderDroneMax: 3,
    MaintenanceDroneMax: 2,
    LoadMem: function(RoomControllerData)
    {
        this.HarvestDroneMax = RoomControllerData[this.Name].HarvestDroneMax;
        this.BuilderDroneMax = RoomControllerData[this.Name].BuilderDroneMax;
        this.MaintenanceDroneMax = RoomControllerData[this.Name].MaintenanceDroneMax;
    },
    SetupDefaultConfig: function(RoomControllerData)
    {
        RoomControllerData[this.Name].HarvestDroneMax = this.HarvestDroneMax;
        RoomControllerData[this.Name].BuilderDroneMax = this.BuilderDroneMax;
        RoomControllerData[this.Name].MaintenanceDroneMax = this.MaintenanceDroneMax;
    }
};

module.exports = RoomConfig;