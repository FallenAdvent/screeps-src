/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('jobs.indexer');
 * mod.thing == 'a thing'; // true
 */

var BirthController =
{
    LoadMem: function(RoomControllerData)
    {
        this.BirthQueue = RoomControllerData[this.Name].BirthQueue;
        this.Retiring = RoomControllerData[this.Name].Retiring;
    },
    SaveMem: function(RoomControllerData)
    {
        RoomControllerData[this.Name].BirthQueue = this.BirthQueue;
        RoomControllerData[this.Name].Retiring = this.Retiring;
    },
    BirthQueue: [],
    Retiring: [],
    Initialized: false,
    ParentController: null,
    Name: "BirthController",
    Manage: function(RoomController)
    {
        this.ParentController = RoomController;
        this.Initialized = true;
    
        if(this.Initialized)
        {
            //Go through any retiring Creeps and see if they have expired
            var itr = this.Retiring.length;
            while(itr >= 0)
            {
                var retiringCreepEntry = this.Retiring[itr];
                if (retiringCreepEntry != null)
                {
                    var creep = Game.creeps[retiringCreepEntry.creepName];
                    //Simply check if the creep still exists in the game list
                    if(creep === undefined || creep == null)
                    {
                        //If not we can assume its dead this seems safer then checking if the ticks to live is valid as it usally is not
                        delete Memory.creeps[retiringCreepEntry.creepName];
                        var ownerController = RoomController.GetController(retiringCreepEntry.ControllerName);
                        var controllerDrones = ownerController.Drones;
                        for (var i in controllerDrones)
                        {
                            if (controllerDrones[i] == retiringCreepEntry.creepName)
                            {
                                controllerDrones.splice(i, 1);
                                ownerController.DroneCount--;
                            }
                        }
                        this.Retiring.splice(itr, 1);
                    }
                }
                itr--;
            }

            if (this.BirthQueue.length)
            {
                var requester = this.BirthQueue.pop();
                var From = RoomController.GetController(requester.ControllerName);

                var creepSettings = From.GetCreepSettings(RoomController.Room.energyAvailable);

                //If no settings were returned we could not afford to spawn the creep at this time
                if (creepSettings != null)
                {
                    var spawns = this.ParentController.Room.find(FIND_MY_STRUCTURES,
                    {
                        filter: { structureType: STRUCTURE_SPAWN }
                    });

                    //Is there a spawn that is not currently spawning
                    for (var i in spawns)
                    {
                        var spawner = spawns[i];

                        //If the spawner is not currently busy
                        if (spawner.spawning == null)
                        {
                            var ret = spawner.createCreep(creepSettings, null, { JobState: null, Retiring: false });
                            if (ret.length >= 3)
                            {
                                From.DroneCount++;
                                From.BirthRequestMade = false;
                                From.Drones.push(ret);
                                return;
                            }
                        }
                    }
                }

                //If we make it to here the request could not be filled!
                this.BirthQueue.push(requester);
            }
        }
    },
    RequestBirth: function(From)
    {
        if (this.Initialized)
        {
            //If we get to here no spawners had enough power to spawn a creep
            From.BirthRequestMade = true;
            //Push the request onto the birthing queue
            this.BirthQueue.push({ ControllerName: From.Name });
        }
    },
    RequestRetiring: function(From,Creep)
    {
        if (Creep.memory.Retiring == false)
        {
            //Sanity Check
            if (this.Initialized) {
                //Push the retiring creep onto the retiring list
                this.Retiring.push({ ControllerName: From.Name, creepName: Creep.name });
                Creep.memory.Retiring = true;
            }
        }
    }

};

module.exports = BirthController;