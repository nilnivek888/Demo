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

export class Track extends GrObject {
    constructor(params={}) {
        let group = new T.Group();
        group.translateX(params.x || 0);
        group.translateY(params.bias || 0.1); // raise track above ground to avoid z-fight
        group.translateZ(params.z || 0);
		super(`Track`,group);

		var curve = new T.CatmullRomCurve3( [
			new T.Vector3( -20, 6, -3 ),
		new T.Vector3( -20, 6, 12 ),
		new T.Vector3( 10, 10, -20 ),
		new T.Vector3( 20, 6, 0 ),
		new T.Vector3( 0, 1, 0 ),
		] ,true,"catmullrom",1);
		this.curve = curve;
		let points = curve.getPoints(200);
		var geometry = new T.BufferGeometry().setFromPoints( points );
		for (let i = 0; i <= 1;  i += 0.1) {
			let m = new T.Mesh(new T.SphereGeometry(1,18,19),new T.MeshPhongMaterial({color:0xffff88}))
			let pos = this.curve.getPointAt(i);
			let l = new T.PointLight( 0xffff88, 0.1 ,100 );
			l.position.set(pos.x,pos.y,pos.z);
			group.add(l);
			m.position.set(pos.x,pos.y,pos.z);
			group.add(m);
		}
		var material = new T.LineBasicMaterial( { color : 0xfff } );
		
		// Create the final object to add to the scene
		var curveObject = new T.Line( geometry, material );
		// this.curve.arcLengthDivisions = 1000;
		// group.add(curveObject);
        this.x = params.x || 0;
        this.z = params.z || 0;
        this.y = params.bias || 0.1;
    }
    eval(u) {
		this.curve.updateArcLengths();
		let p = u * 2 * Math.PI;
		let sway = 0;
		let pos = this.curve.getPointAt(u);
        return [pos.x , pos.y, pos.z+sway * Math.cos(p) ];
    }
    tangent(u) {
		this.curve.updateArcLengths();
        // unit tangent vector - not the real derivative
        return this.curve.getTangentAt(u).normalize();
    }
}

export class Plane extends Loaders.FbxGrObject {
    /**
     * Plane
     * @param {Object} params 
     */
	constructor(track,params={}) {
		super({fbx:"./Assets/f16.fbx",norm:3.0,name:"plane"});
		let plane = this;
		let func = function() {
			plane.objects[0].traverse(function(c) {
				c.visible = true;
				if (c instanceof T.Mesh) {
					c.material = new T.MeshStandardMaterial({metalness:0.7,color:"red"});
					c.material.needsUpdate = true;
				}
			});
			console.log("aaaaaaaaa");
		}
		setTimeout(func,1000);
		this.u = 0;
        this.ridePoint = new T.Object3D();
		this.ridePoint.translateY(0.5);
		this.ridePoint.rotateX(-Math.PI/2);
        this.objects[0].add(this.ridePoint);
		this.rideable = this.ridePoint;
		this.objects[0].visible = false;
		this.track = track;
		this.axis = new T.Vector3( );
		this.r = 0;
	}
	advance(delta,timeOfDay) {
		let deltaSlowed=delta/2000;
		let up = new T.Vector3(0,1,0);
		this.u = (this.u + deltaSlowed)%1;
        let pos = this.track.eval(this.u);
        this.objects[0].position.set(pos[0],pos[1],pos[2]);
		let t = this.track.tangent(this.u);
		this.axis.crossVectors( up, t ).normalize();
		this.r = Math.acos( up.dot( t ) );
		this.objects[0].quaternion.setFromAxisAngle( this.axis, this.r );
		
	}
}