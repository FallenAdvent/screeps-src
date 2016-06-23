/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('controllers.masterController');
 * mod.thing == 'a thing'; // true
 */

var MaintenanceDrone =
{

    DoTask: function (Controller, Drone)
    {
        if (Drone == null)
        {
            console.log("Null drone passed to BuilderDrone Object");
            return;
        }

        if (Drone.memory.JobState == null)
        {
            Drone.memory.JobState = "Harvest";
        }

        if (Drone.memory.JobState == "Harvest") {
            //Is this drone at full carry capacity from harvesting
            if (_.sum(Drone.carry) == Drone.carryCapacity)
            {
                Drone.memory.JobState = "Repair";
            }
            else
            {
                var source = Controller.RoomController.GetController("ResourceController").GetSource();
                if (Drone.harvest(source) == ERR_NOT_IN_RANGE) {
                    Drone.moveTo(source);
                    return;
                }
            }

        }

        if (Drone.memory.JobState == "Repair")
        {
            //Is this drone out of energy
            if (_.sum(Drone.carry) == 0)
            {
                Drone.memory.JobState = "Harvest";
                return;
            }

            //Get a construction site
            var repairTarget = Controller.RoomController.GetController("ResourceController").GetRepairTarget();
            if (repairTarget != null) {
                if (Drone.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                    Drone.moveTo(repairTarget);
                }
            }
        }
    }
};

module.exports = MaintenanceDrone;