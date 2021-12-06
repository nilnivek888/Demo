/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 * 
 * This is the main file - it creates the world, populates it with 
 * objects and behaviors, and starts things running
 * 
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 * 
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

// these four lines fake out TypeScript into thinking that THREE
// has the same type as the T.js module, so things work for type checking
// type inferencing figures out that THREE has the same type as T
// and then I have to use T (not THREE) to avoid the "UMD Module" warning
/**  @type typeof import("./THREE/threets/index"); */
let T;
// @ts-ignore
T = THREE;

import { GrWorld } from "./Framework/GrWorld.js";
import {GrObject } from "./Framework/GrObject.js";  // only for typing
import * as Helpers from "./Libs/helpers.js";
import { WorldUI } from "./Framework/WorldUI.js";
/** These imports are for the examples - feel free to remove them */
import {House1, House2, Tree1, Tree2} from "./house.js";
import {Road, Car, CarSpawn} from "./track.js";
import {Helicopter, Collision, Helipad} from "./helicopter.js";
import { Track, Plane } from "./plane.js";
import { Bean } from "./others.js";

/**
 * The Graphics Town Main - 
 * This builds up the world and makes it go...
 */
function grtown() {
    // make the world
    let world = new GrWorld({
        width:1000, height:600,         // make the window reasonably large
		groundplanesize:24,             // make the ground plane big enough for a world of stuff
		lights:[new T.AmbientLight(0xfffff8, 1)],
    });
	
    // put stuff into it - you probably want to take the example stuff out first


    /********************************************************************** */
    /** EXAMPLES - student should remove these and put their own things in  */
	/***/
	world.add(new Bean(world));
	
    // world.add(new ShinySculpture(world));
	let t = new Track({x:0,bias:0,z:0});
	world.add(t);
	world.add(new Plane(t));
    /** Race Track - with three things racing around */
    world.add(new CarSpawn(world,{x:25,z:11}));
	world.add(new CarSpawn(world,{x:13,z:25}));
	world.add(new CarSpawn(world,{x:-11,z:25}));
	world.add(new CarSpawn(world,{x:11,z:-25}));
	world.add(new CarSpawn(world,{x:-13,z:-25}));
	// world.add(new CarSpawn(world,{x:-25,z:13}));
	world.add(new CarSpawn(world,{x:-25,z:-11}));
	world.add(new CarSpawn(world,{x:25,z:-13}));
    // and make sure they are in the world
	world.add(new Road({x:6,z:12,length:48}));
	world.add(new Road({x:-6,z:12,length:48}));
	world.add(new Road({x:12,z:-6,length:48, rotate:1}));
	world.add(new Road({x:12,z:6,length:48, rotate:1}));
	/** Helicopter - first make places for it to land*/
	let pad1 = new Helipad(19,1,19);
	let pad2 = new Helipad(19,1,-19);
	let pad3 = new Helipad(-19,1,-19);
	let pad4 = new Helipad(-19,1,19);

    world.add(pad1);
    world.add(pad2);
    world.add(pad3);
	world.add(pad4);
	world.add(new House1({x:18,z:0,rotate:2}));
	world.add(new House2({x:-20,z:2,rotate:0}));
	world.add(new Tree1({x:3,z:-18,rotate:2}));
	world.add(new Tree2({x:-7,z:17,rotate:0}));
    let copter1 = new Helicopter(world,pad1,{altitude:8});
	world.add(copter1);
	let copter2 = new Helicopter(world,pad2,{altitude:9});
	world.add(copter2);
	let copter3 = new Helicopter(world,pad3,{altitude:6});
	world.add(copter3);
	let copter4 = new Helicopter(world,pad4,{altitude:7});
	world.add(copter4);

	world.active_object = world.objects.filter(ob => ob.rideable)[0];
    /** EXAMPLES - end - things after this should stay                      */
    /********************************************************************** */
    // build and run the UI

    // only after all the objects exist can we build the UI
    // @ts-ignore       // we're sticking a new thing into the world
	world.ui = new WorldUI(world);
    // now make it go!
    world.go();
}
Helpers.onWindowOnload(grtown);