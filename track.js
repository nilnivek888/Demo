/*jshint esversion: 6 */
// @ts-check

/*
 * Graphics Town Example Objects
 *
 * Simple Circular Track - and an object that goes around on it
 */

// these four lines fake out TypeScript into thinking that THREE
// has the same type as the T.js module, so things work for type checking
// type inferencing figures out that THREE has the same type as T
// and then I have to use T (not THREE) to avoid the "UMD Module" warning
/**  @type typeof import("./THREE/threets/index"); */
let T;
// @ts-ignore
T = THREE;

// we need the GrObject
import { GrObject } from "./Framework/GrObject.js";
import { GrCube } from "./Framework/SimpleObjects.js";
import * as Loaders from "./Framework/loaders.js";
import { Debris } from "./explosion.js";
import { GrWorld } from "./Framework/GrWorld.js";
import {shaderMaterial} from "./Framework/shaderHelper.js";
import { WorldUI } from "./Framework/WorldUI.js";
import { Collision } from "./helicopter.js";
export var collisions = [];
let rdctr = 0; 
export class Road extends GrObject {
    constructor(params={}) {
		let width = params.width || 4;
		let length = params.length || 20;
		let widthSegments = width;
		let lengthSegments = length;
		let geo = new T.PlaneGeometry(width, length, widthSegments, lengthSegments)
        let material = new T.MeshStandardMaterial({side:T.DoubleSide, color:"#909090",roughness:1.0});
		let mesh = new T.Mesh(geo, material);
		mesh.position.set(params.x || 0,params.bias || 0.01,params.z || 0);
		mesh.rotateY(Math.PI/2*(params.rotate||0));
		mesh.translateZ(-length/2);
		mesh.rotateX(Math.PI/2);
        let group = new T.Group();
		group.add(mesh);
        group.translateX(params.x || 0);
        group.translateY(params.bias || 0.1); // raise track above ground to avoid z-fight
        group.translateZ(params.z || 0);
		super(`Road${rdctr++}`,group);
		this.length = length;
        this.x = params.x || 0;
        this.z = params.z || 0;
		this.y = params.bias || 0.01;
    }
    eval(u) {
        return [this.x, this.y, this.z - this.length*u];
    }
    tangent(u) {
        let p = u * 2 * Math.PI;
        return [0, 0,this.length];
    }
}

let turnctr = 0;
export class Turn extends GrObject{
    constructor(direction, params={}) {
		let group = new T.Group();
		super(`Turn${turnctr++}`,group);
		this.x = params.x || 0;
        this.z = params.z || 0;
        this.y = params.bias || 0.1;
		this.direction = direction;
		this.pivot = params.pivot;
		this.from = params.from;
	}

	eval(u) {
		let p = u * 0.5 * Math.PI;
		
		if (this.direction == "right") {
			p -= this.from * Math.PI/2;
			return [this.pivot.x - Math.sin(p), this.pivot.y, this.pivot.z + Math.cos(p)];
		} else if (this.direction == "left") {
			p += Math.PI;
			p += this.from * Math.PI/2;
			return [this.pivot.x + 3*Math.sin(p), this.pivot.y, this.pivot.z + 3*Math.cos(p)];
		} else if (this.direction == "str8") {
		}
    }
    tangent(u) {
		let p = u * 0.5 * Math.PI;
		if (this.direction == "right") {
			p -= this.from * Math.PI/2;
			return [Math.cos(p), 0, Math.sin(p)];
		} else if (this.direction == "left") { 
			p += this.from * Math.PI/2;
			return [Math.cos(p), 0, -Math.sin(p)];
		} else if (this.direction == "str8") {
			return [0, 0, 0];
		}
    }
}
const intersections = [[12,12],[12,-12],[-12,12],[-12,-12]];
export var cars = [];
// define your vehicles here - remember, they need to be imported
// into the "main" program
let carctr = 0;
export class Car extends GrObject {
	constructor(world,params={}){
		let car = new T.Object3D();
		let context = new T.Shape();
		context.moveTo(0.16,2.92);
		context.bezierCurveTo(1.88,4.32,5,5.15,7.34,5.29);
		context.bezierCurveTo(12.44,9.5,18,9,24,4.75);
		context.lineTo(24.6,3.88);
		context.lineTo(25,2.6);
		context.lineTo(23.05,1.53);
		context.lineTo(0.3,1.46);
		context.lineTo(0.3,1.46);
		context.lineTo(0.16,2.92);
		let win = new T.Shape();
		win.moveTo(8.4,7);
		win.bezierCurveTo(12,7.8,12.5,8,14,7.5);
		win.lineTo(20,7);
		win.bezierCurveTo(21,7.3,23.5,6.1,23.7,6);
		
		win.closePath();
		const winSettings = {
			steps: 18,
			depth: 1,
			bevelEnabled: true,
			bevelThickness:6,
			bevelSize: 2,
			bevelSegments: 18,
		};
		let winG = new T.ExtrudeGeometry(win,winSettings);
		let wind = new T.Mesh(winG,new T.MeshStandardMaterial({color:'#333'}));
		wind.translateZ(0.15);
		super(`car${carctr++}`,car);
		this.x = params.x || 0;
		this.y = params.y || 0.1;
		this.z = params.z || 0;
		const bodySettings = {
			steps: 9,
			depth: 4,
			bevelEnabled: true,
			bevelThickness: 5,
			bevelSize: 2,
			bevelSegments: 18,
		};
		this.world = world;
		this.color = params.color || '#CE1600';
		wind.scale.set(0.1,0.1,0.1);
		car.add(wind);
		let bodyG = new T.ExtrudeGeometry(context,bodySettings);
		let body = new T.Mesh(bodyG,new T.MeshStandardMaterial({color:this.color}));
		body.name = "body";
		body.scale.set(0.1,0.1,0.1);
		car.add(body);
		let w1G = new T.CylinderGeometry(0.3,0.3,0.15,18);
		let wM = new T.MeshLambertMaterial({color:this.color});
		let wD = new T.TorusKnotBufferGeometry(0.15, 0.05, 64, 10, 2, 3);
		this.w1 = new T.Group();
		this.w1.add(new T.Mesh(wD,wM));
		let w1M = new T.Mesh(w1G,new T.MeshLambertMaterial({color:'#333333'}));
		this.w1.add(w1M);
		w1M.rotateX(Math.PI/2);
		this.w1.position.set(0.5,0.2,0.9);
		this.w2=this.w1.clone();
		this.w2.position.set(2.1,0.2,0.9);
		car.add(this.w2);
		this.w3=this.w1.clone();
		this.w3.position.set(0.5,0.2,-0.5);
		car.add(this.w3);
		this.w4=this.w1.clone();
		this.w4.position.set(2.1,0.2,0.-0.5);
		car.add(this.w4);
		car.add(this.w1);
		car.position.set(0,-9.5,0);
		this.u = 0;
		this.state = undefined;
		this.rotate = params.rotate || 0;
		car.rotation.y = Math.PI/2*this.rotate;
		car.position.set(this.x,this.y,this.z);
		cars.push(this);
		body.translateX(-1);
		wind.translateX(-1);
		car.traverse(function(obj) {
			if (obj instanceof T.Mesh) {
				obj.castShadow = true;
				obj.receiveShadow = true;
			}
		});
		this.w1.translateX(-1);
		this.w2.translateX(-1);
		this.w3.translateX(-1);
		this.w4.translateX(-1);
		this.turn = undefined;
		this.pivot = undefined;
		this.exploded = false;
		this.debris = [];
	}
	collide(car2) {
		return Math.pow(car2.objects[0].position.x-this.objects[0].position.x,2)
		+ Math.pow(car2.objects[0].position.z-this.objects[0].position.z,2) <=2;
	}
	vanish() {
		cars = cars.filter(ob => ob != this); // delete this element
		this.world.objects= this.world.objects.filter(ob => ob != this);
		this.world.scene.remove(this.objects[0]);
	}
	explode() {
		this.exploded = true;
		let newcolor = new T.Color(this.color);
			newcolor.r -= 0.3;
			newcolor.g -= 0.3;
			newcolor.b -= 0.3;
		for (let i = 0; i < 20; i ++) {
			let d = new Debris(this.world,{x:this.objects[0].position.x,
				y:this.objects[0].position.y,
				z:this.objects[0].position.z,
				vx:T.Math.randFloatSpread(0.5),
				vy:T.Math.randFloatSpread(0.2) + 0.1,
				vz:T.Math.randFloatSpread(0.5),
				color:newcolor});
			this.debris.push(d);
			this.world.add(d);
		
		}
		let c = new Collision(this.objects[0].position.x,
			this.objects[0].position.y,
			this.objects[0].position.z);
		collisions.push(c);
		this.world.add(c);
	}
	advance(delta,timeOfDay) {
		let car1 = this;
		if (!this.exploded) {
			this.w1.rotateZ(delta/20);
			this.w2.rotateZ(delta/20);
			this.w3.rotateZ(delta/20);
			this.w4.rotateZ(delta/20);
			cars.forEach(function(c2) {
				if (c2 != car1 && car1.collide(c2)){
					car1.explode();
					if(!c2.exploded)
						c2.explode();
				}
			});
			let pos = this.objects[0].position;
			if (pos.x > 25 || pos.x <-25 || pos.z > 25 || pos.z < -25)
				this.vanish();
			if (this.state == undefined)
				intersections.forEach(function(i) {
					if(Math.pow(i[0]-pos.x,2)+Math.pow(i[1]-pos.z,2)<=5) {
						car1.state = Math.floor(Math.random()*3); // randomly decide a direction
					}
				});
			if (this.state == 2) { // left
				if (this.u == 0) {
					this.pivot = new Turn("left",{pivot:this.objects[0].localToWorld(new T.Vector3(0,0,3)),from:this.rotate});
					this.rotate = (this.rotate+1)%4;
				}
				let pos = this.pivot.eval(this.u);
				let dir = this.pivot.tangent(this.u);
				let zAngle = Math.atan2(dir[2],dir[0]);
				this.objects[0].rotation.y = -zAngle ;
				this.objects[0].position.set(pos[0],pos[1],pos[2]);
				this.u+=0.01;
			} else if (this.state == 0) { //right
				if (this.u == 0) {
					this.pivot = new Turn("right",{pivot:this.objects[0].localToWorld(new T.Vector3(0,0,-1)),from:this.rotate});
					this.rotate = (this.rotate+3)%4;
				}
				let pos = this.pivot.eval(this.u);
				let dir = this.pivot.tangent(this.u);
				let zAngle = Math.atan2(dir[2],dir[0]);
				this.objects[0].rotation.y = -zAngle ;
				this.objects[0].position.set(pos[0],pos[1],pos[2]);
				this.u+=0.02;
			} else if (this.state == 1) { //str8
			}
			this.objects[0].translateX(-0.1);
			if (this.u >= 1) {
				this.u = 0;
				this.state = undefined;
				this.objects[0].position.set(Math.round(this.objects[0].position.x),
					Math.round(this.objects[0].position.y),
					Math.round(this.objects[0].position.z));
				this.objects[0].translateX(-0.1);
				this.objects[0].rotation.y = this.rotate * Math.PI/2;
			}
		} else {
			let newcolor = new T.Color(this.color);
			newcolor.r -= 0.01;
			newcolor.g -= 0.01;
			newcolor.b -= 0.01;
			this.color = newcolor;

			this.objects[0].traverse( function ( child ) {
			if ( child instanceof T.Mesh && child.name === "body") {
				child.material = new T.MeshStandardMaterial({color:newcolor});
			}});
			this.debris.forEach(d => d.advance(delta,timeOfDay));
		}
    }
}
let cspawn = 0;
export class CarSpawn extends GrObject {
	constructor(world,params={}){
		let carspawn = new T.Object3D;
		super(`carspawn-${cspawn++}`,carspawn);
		this.x = params.x;
		this.z = params.z;
		this.to = params.to;
		this.world = world;
		this.timer = Math.floor(2000*Math.random());
		if (this.x == 25)
			this.to = 0;
		else if (this.x == -25)
			this.to = 2;
		else if (this.z == 25)
			this.to = 3;
		else if (this.z == -25)
			this.to = 1;
			this.spawn();
	}
	spawn() {						// generate random color, not totally random. bright ones
		let h = Math.floor(Math.random() * 360);
		let s = 70 + Math.floor(Math.random() * 30);
		let l = 40 + Math.floor(Math.random() * 30);
		let c = "hsl(" + h +',' + s + '%,' + l + '%, 1.0)';
		let color = new T.Color(c) ;
		let car = new Car(this.world,{x:this.x,
										z:this.z,
										rotate:this.to,
										color:c});
		this.world.add(car);
			
	}
	advance(delta,timeOfDay) {
		if (this.timer++ %1000 == 1) {
			this.spawn();
		}
	}
}