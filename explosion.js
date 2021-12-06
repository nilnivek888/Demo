/*jshint esversion: 6 */
// @ts-check

/**  @type typeof import("./THREE/threets/index"); */
let T;
// @ts-ignore
T = THREE;
const grav = 0.01;
import { GrCube } from "./Framework/SimpleObjects.js";
import { GrObject } from "./Framework/GrObject.js";

let dctr = 0;
export class Debris extends GrObject {
	constructor(world,params={}) {
		let cube = new T.Mesh(new T.CubeGeometry(params.size||0.3,params.siz||0.3,params.size||0.3),new T.MeshStandardMaterial({color:params.color||"#888"}));
		cube.position.set(params.x,params.y,params.z);
		super(`debris-${dctr++}`,cube);
		this.x = params.x || 0;
		this.y = params.y || 0;
		this.z = params.z || 0;
		this.vx = params.vx || 0;
		this.vy = params.vy || 0;
		this.vz = params.vz || 0;
		this.timer = 500;
		this.static = false;
		this.world = world;
		
	}
	destroy(world) {
		world.scene.remove(this.objects[0]);
		world.objects = world.objects.filter(ob => ob != this);
	}
	advance(delta,timeOfDay) {
		this.x += this.vx;
		this.y += this.vy;
		this.z += this.vz;
		if (this.static == false && this.y>0) {
			this.objects[0].position.set(this.x,this.y,this.z);
			this.vy -= grav;
		} else if (this.static == false && this.vy > 0.1) {
			this.vy = -0.7*this.vy;
		} else
			this.static = true;
		if (this.y<=0 && this.vy < 0.1 || this.static == true) {
			this.timer -= 1;
		}
		if (this.timer <= 0) {
			this.destroy(this.world);
		}
    }
}