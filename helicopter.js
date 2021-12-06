/*jshint esversion: 6 */ 
// @ts-check


// @ts-ignore
let T = THREE;

import { GrObject } from "./Framework/GrObject.js";
import {collisions, Car, cars} from "./track.js"
export class Collision extends GrObject {
    /**
     * Car wreck
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x,y,z) {
		let targ = new T.Object3D;
        super(`Collision-${collisions.length}`,targ);
		this.targ = targ;
		this.dibs = false;
		targ.position.x = x ? x : 0;
       	targ.position.y = (y ? y : 0) + 0.01;
		targ.position.z = z ? z : 0;
        targ.receiveShadow = true;
        targ.castShadow = false;
    }
}
let hpad = 0;
export class Helipad extends GrObject {
    /**
     * Make a place for a helicopter to land
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x,y,z) {
		let plat = new T.Object3D;
		super(`Helipad-${hpad++}`,plat);
		this.x = x;
		this.y = y;
		this.z = z; 
		let h = 1.7;
		this.height = h;
		plat.add(new T.Mesh(new T.CylinderGeometry(3,4.6,h,18,18),new T.MeshStandardMaterial({color:"gray"})));
		plat.position.set(x || 0,y || 0,z || 0);
    }
}

let helicopterCount=0;
export class Helicopter extends GrObject {
    /**
     * Simple looking helicopter - with a complex behavior
     * @param {Helipad} home
     * @param {Object} params 
     */
    constructor(world,home,params={}) {
    let quad = new T.Object3D();
    super(`Helicopter-${helicopterCount++}`,quad);
	this.helicopter = quad;
	let tempGeom = new T.BoxBufferGeometry(1,0.1,3);
    let tempMaterial = new T.MeshStandardMaterial({color:"#333"});
    let blade1 = new T.Mesh(tempGeom,tempMaterial);
	let pivot1 = new T.Object3D();
	let center = new T.Mesh(new T.CylinderBufferGeometry(0.5,0.5,0.6,18),new T.MeshStandardMaterial({color:"black"}));
	pivot1.add(center);
	pivot1.position.set(0,0,0);
	pivot1.add(blade1);
	let blade2 = blade1.clone();
	let blade3 = blade1.clone();
	blade1.position.set(0,0,1.5);blade1.rotateZ(0.5);
	blade2.rotateY(Math.PI*2/3);
	blade2.translateZ(1.5);
	blade2.rotateZ(0.5);
	blade3.rotateY(Math.PI*4/3);
	blade3.translateZ(1.5);
	blade3.rotateZ(0.5);
	pivot1.add(blade2);
	pivot1.add(blade3);
	let mat = new T.MeshStandardMaterial({color:"#444"})
	let body = new T.Mesh(new T.BoxBufferGeometry(4,2,4),mat);
	this.body = body;
	body.receiveShadow = true;
	let prplr1 = new T.Object3D();
	let donut = new T.Mesh(new T.TorusBufferGeometry(4, 1, 36, 36),mat);
	donut.name="color";
	body.name="color";
	body.rotateY(Math.PI/4);
	donut.rotateX(Math.PI/2);
	prplr1.add(donut);
	prplr1.add(pivot1);
	prplr1.position.set(4,0,4);
	this.home = home;
	this.world = world;
	this.state = 0;
	this.delay = 0;
	this.delay2 = 0;
	this.ray = new T.SpotLight( 0xffffff, 10 ,10,.3 ,0);
	this.ray.penumbra = 0;
	quad.traverse(function(obj) {
		if (obj instanceof T.Mesh) {
			obj.castShadow = true;
			obj.receiveShadow = true;
		}
	});
	this.helicopter.add(this.ray);
	this.ray.position.y = 0;
	this.ray.visible = false;
	this.current = undefined;
	this.altitude = params.altitude || 5;
	this.rideable = this.helicopter;
	this.rideable.rotateY(Math.PI);
	this.headingHome = false;
	let prplr2 = prplr1.clone();
	prplr1.name="prplr1";
	prplr2.position.set(-4,0,4);
	prplr2.name="prplr2";
	let prplr3 = prplr1.clone();
	prplr3.name="prplr3";
	prplr3.position.set(4,0,-4);
	let prplr4 = prplr1.clone();
	prplr4.name="prplr4";
	prplr4.position.set(-4,0,-4);
	this.prplr1 = prplr1;
	this.prplr2 = prplr2;
	this.prplr3 = prplr3;
	this.prplr4 = prplr4;
	this.helicopter.position.set(this.home.x,this.home.y+this.home.height,this.home.z);
	quad.add(body);
	quad.add(prplr1);
	quad.add(prplr2);
	quad.add(prplr3);
	quad.add(prplr4);
	quad.receiveShadow = true;
	quad.scale.set(0.3,0.3,0.3);
	}
	dist(pos2) {
		let pos1 = this.helicopter.position;
		let dx = pos1.x - pos2.x;
		let dz = pos1.z - pos2.z;
		return Math.sqrt(dx*dx + dz*dz);
	}

	clear() {
		let pos = this.helicopter.position;
		let THIS = this;
		cars.forEach(function(c) {
			if(THIS.dist(c.objects[0].position)<=1)
				c.vanish();
		});
	}
    /** - I don't know why the type declarations aren't inherited
    * @param {number} delta 
    * @param {number} timeOfDay
    * 
    * The helicopter has a state machine which tells what it's motion is. 
    * In each state, it moves to a goal, and when it gets there, picks the next state
    */
   advance(delta,timeOfDay) {
		// all the speeds are arbitrary, so we tune things here
        let deltaSlowed=delta/200;
        // spin the rotor around - even when the helicopter is landed
		this.prplr1.rotateY(deltaSlowed*4);
		this.prplr2.rotateY(deltaSlowed*4);
		this.prplr3.rotateY(deltaSlowed*4);
		this.prplr4.rotateY(deltaSlowed*4);
		let targets = collisions.filter(obj => obj!=this.current && !obj.dibs);
        // state machine - depending on state, do the right thing
        if (targets.length != 0 || this.current) {
			if (this.headingHome && !this.current)
				this.state = 1;
            switch(this.state) {
                case 0:         // initialization
                    this.state = 1;
					this.delay = 1;
					this.delay2 = 3;
                    break;
                case 1:         // ascend to altitude
                    this.helicopter.position.y +=  deltaSlowed*5;
                    if (this.helicopter.position.y >= this.altitude) {
                        this.helicopter.position.y = this.altitude;
                        // pick a random collision - must be different than where we are
                        let pick = Math.floor(Math.random() * targets.length);
						this.current = targets[pick];
						this.current.dibs = true;
						this.ray.target = this.current.targ;
                        // compute the spin, before we start
                        let dx = this.current.targ.position.x - this.helicopter.position.x;
                        let dz = this.current.targ.position.z - this.helicopter.position.z;
                        let ds = Math.sqrt(dx*dx+dz*dz);
                        if (ds>0) {
                            // compute the goal angle
                            this.goalangle = Math.atan2(dx,dz);
                            // get the current angle
                            let quat = new T.Quaternion();
                            this.helicopter.getWorldQuaternion(quat);
                            let eu = new T.Euler();
                            eu.setFromQuaternion(quat);
                            this.currentangle = eu.y;
                            this.state = 4;  
                        } else {
                            this.state = 5;       // don't bother spinning
                        }
                    }      
                    break;
				case 2:         // descend
					this.delay2 -= deltaSlowed;
					this.ray.visible = true;
                    if (this.delay2 <= 0) {
						this.ray.visible = false;
						this.delay2 = 3;
						this.state = 3;
						this.clear();
                    }      
                    break;
				case 3:         // wait before takeoff
                    this.delay -= deltaSlowed;
                    if (this.delay<0) {
						this.state = 1;
						this.delay = 1;         // take off again
						this.current = undefined;
                    }
                    break;
                case 4:         // rotate to point towards destination
                    let ad = this.goalangle - this.currentangle;
                    if (ad>0.1) {
                        this.currentangle += 0.05;
                    } else if (ad<-0.1) {
                        this.currentangle -= 0.05;
                    } else {
                        this.state=5;
                        this.currentangle = this.goalangle;
                    }
                    this.helicopter.setRotationFromEuler(new T.Euler(0,this.currentangle,0));
                    break;
				case 5:         // fly to destination
					if (!this.current) {
						this.state = 1;
						break;
					}
                    let dx = this.current.targ.position.x - this.helicopter.position.x;
                    let dz = this.current.targ.position.z - this.helicopter.position.z;
                    let dst = Math.sqrt(dx*dx+dz*dz);
                    let ds = deltaSlowed*5;
                    if (dst > ds) {
                        this.helicopter.position.x += dx * ds / dst;
                        this.helicopter.position.z += dz * ds / dst;
                    } else {
                        this.helicopter.position.x = this.current.targ.position.x;
                        this.helicopter.position.z = this.current.targ.position.z;
                        this.state = 2;
                    }
                    break;
            }
        } else {
			if (this.dist(this.home) > 0 && !this.current)
				this.headingHome = true;
			let dx = this.home.x - this.helicopter.position.x;
			let dz = this.home.z - this.helicopter.position.z;
			let dst = Math.sqrt(dx*dx+dz*dz);
			let ds = deltaSlowed*5;
			switch(this.state) {
				case 1:
					if (ds>0) {
						// compute the goal angle
						this.goalangle = Math.atan2(dx,dz);
						// get the current angle
						let quat = new T.Quaternion();
						this.helicopter.getWorldQuaternion(quat);
						let eu = new T.Euler();
						eu.setFromQuaternion(quat);
						this.currentangle = eu.y;
						this.state = 4;  
					} else {
						this.state = 5;       // don't bother spinning
					}
					break;
				case 4:
					let ad = this.goalangle - this.currentangle;
					if (ad>0.1) {
						this.currentangle += 0.05;
					} else if (ad<-0.1) {
						this.currentangle -= 0.05;
					} else {
						this.state=5;
						this.currentangle = this.goalangle;
					}
					this.helicopter.setRotationFromEuler(new T.Euler(0,this.currentangle,0));
					break;
				case 5:
					if (dst > ds) {
						this.helicopter.position.x += dx * ds / dst;
						this.helicopter.position.z += dz * ds / dst;
					} else {
						this.helicopter.position.x = this.home.x;
						this.helicopter.position.z = this.home.z;
						if (this.helicopter.position.y<=this.home.height) {
							this.helicopter.position.y=this.home.y +this.home.height;
							this.state = 0;
						}
						this.helicopter.position.y -= deltaSlowed;
						
					}
					break;
			}
		}
	}
	
	lookFromLookAt() {
        let bbox = new T.Box3();
        bbox.setFromObject(this.objects[0]);
        let x = (bbox.max.x+bbox.min.x)/2;
        let y = (bbox.max.y+bbox.min.y)/2;
        let z = (bbox.max.z+bbox.min.z)/2;

        // make the box a little bigger to deal with think/small objects
        let dx = (bbox.max.x-x) + 0.05;
        let dy = (bbox.max.y-y) + 0.05;
        let dz = (bbox.max.z-z) + 0.05;

        let d = Math.max(dx,dy,dz);

        let fx = x + d*3;
        let fy = y + d*3;
        let fz = z + d*3;

        return [fx,fy,fz,x,y,z];
    }
}

