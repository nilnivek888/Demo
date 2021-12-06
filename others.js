/*jshint esversion: 6 */
// @ts-check
/**  @type typeof import("./THREE/threets/index"); */
let T;
// @ts-ignore
T = THREE;

// get things we may need
import { GrWorld } from "./Framework/GrWorld.js";
import { GrObject } from "./Framework/GrObject.js";
import * as Loaders from "./Framework/loaders.js";

export class Bean extends Loaders.ObjGrObject {
	constructor(world,params) {
		super({obj:"./Assets/bean.obj",name:"bean",norm:10,x:0,z:5,y:2.5});
		this.objects[0].rotateX(-Math.PI/2);
		this.world = world;
		this.cubecam = new T.CubeCamera(1,1000,1000);
		this.cubecam.position.copy(this.objects[0].position);
		this.cubecam.translateY(2);
		let bean = this;
		let cam = this.cubecam;
		let mat = new T.MeshStandardMaterial(
		{
			color: "silver",
			metalness : 1,
			// @ts-ignore   // envMap has the wrong type
			envMap : cam.renderTarget.texture
		});
		let func = function() {
			bean.objects[0].traverse(function(c) {
				c.visible = true;
				if (c instanceof T.Mesh) {
					c.material = mat;
					c.material.needsUpdate = true;
				}
			});
		}
		setTimeout(func,2000);
	}
	advance(delta, timeOfDay) {
        this.cubecam.update(this.world.renderer,this.world.scene);
    }
}
