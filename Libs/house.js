
/*jshint esversion: 6 */
// @ts-check

// these four lines fake out TypeScript into thinking that THREE
// has the same type as the T.js module, so things work for type checking
// type inferencing figures out that THREE has the same type as T
// and then I have to use T (not THREE) to avoid the "UMD Module" warning
/**  @type typeof import("./THREE/threets/index"); */
let T;
// @ts-ignore
T = THREE;

// get things we need
import { GrObject } from "./Framework/GrObject.js";

export class House1 extends GrObject {
	constructor(params={}) {
		const shape = new T.Shape();
		shape.moveTo(-2.5,0);
		shape.lineTo(2.5,0);
		shape.lineTo(2.5,3.5);
		shape.lineTo(0,6.5);
		shape.lineTo(-2.5,3.5);
		shape.lineTo(-2.5,0);
		const bodySettings = {
			depth: 7,
			bevelEnabled: false,
		};
		const winSettings = {
			depth: 25,
			bevelEnabled: false,
		};
		let house = new T.Object3D(); 
		let body = new T.ExtrudeGeometry(shape, bodySettings);
		let win = new T.ExtrudeGeometry(shape, winSettings);
		win.scale(0.2,0.2,0.2);
		win.rotateY(Math.PI/2);
		let tl=new T.TextureLoader().load("./Texture/window.jpg");
		let t2 = new T.TextureLoader().load("./Texture/map.png");
		let t3 = new T.TextureLoader().load("./Texture/roof.jpg");
		let t4 = new T.TextureLoader().load("./Texture/wood.jpg");
		let t5 = new T.TextureLoader().load("./Texture/roof2.jpg");
		let t6 = new T.TextureLoader().load("./Texture/door.jpg");
		t4.wrapS = T.RepeatWrapping;
		t4.wrapT = T.RepeatWrapping;
		let wintex = new T.Geometry();
		let doorMatAry = [];
		doorMatAry.push(
			new T.MeshStandardMaterial({map:t6, roughness:0.75}),
			new T.MeshStandardMaterial({map:t4, roughness:0.75}),
			new T.MeshStandardMaterial({map:t4, roughness:0.75}),
			new T.MeshStandardMaterial({map:t4, roughness:0.75}),
			new T.MeshStandardMaterial({map:t4, roughness:0.75}),
			new T.MeshStandardMaterial({map:t4, roughness:0.75}),
			);
		let doorM = new T.Mesh(new T.BoxGeometry(4,2,1),doorMatAry);
		house.add(doorM);
		doorM.position.set(1,1,3.5);

		let matAry = [];
		matAry.push(new T.MeshStandardMaterial({map:tl, roughness:0.75}),
			new T.MeshStandardMaterial({ map:t3,roughness:0.75}),
			);

		win.faceVertexUvs = [ [] ];
		win.faceVertexUvs[0].push(
			[new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 0.5)],
			[new T.Vector2(0.5, 1),new T.Vector2(0, 0.5),  new T.Vector2(0, 0)],
			[new T.Vector2(0, 0),new T.Vector2(1, 0.5),  new T.Vector2(0.5, 1)],
			[new T.Vector2(0, 0.5), new T.Vector2(0, 0), new T.Vector2(1, 0)],
			[new T.Vector2(1, 0),new T.Vector2(1, 0.5),  new T.Vector2(0.5, 1)],
			[new T.Vector2(0.5, 1),new T.Vector2(0,0.5),  new T.Vector2(1, 0)],
		);
		win.faceVertexUvs[0].push(
			// side 1
			[new T.Vector2(1, 0.5), new T.Vector2(0, 0.5), new T.Vector2(0.5, 1)],
			[new T.Vector2(1, 0.5), new T.Vector2(0, 0.5), new T.Vector2(0.5, 1)],
			// top 1
			[new T.Vector2(1, 0.5), new T.Vector2(0, 0.5), new T.Vector2(0.5, 1)],
			[new T.Vector2(1, 0.5), new T.Vector2(0, 0.5), new T.Vector2(0.5, 1)],
			// top 2
			[new T.Vector2(1, 0.5), new T.Vector2(0, 0.5), new T.Vector2(0.5, 1)],
			[new T.Vector2(1, 0.5), new T.Vector2(0, 0.5), new T.Vector2(0.5, 1)],
			// side 2
			[new T.Vector2(1, 0.5), new T.Vector2(0, 0.5), new T.Vector2(0.5, 1)],
			[new T.Vector2(1, 0.5), new T.Vector2(0, 0.5), new T.Vector2(0.5, 1)],
		);
		win.computeFaceNormals();
		let win1 = new T.Mesh(win,matAry);
		
		win1.position.set(-2.5,3.7,1.5);
		let wintexMesh = new T.Mesh(wintex,matAry);
		win1.add(wintexMesh);
		wintexMesh.position.set(5,0,0);
		let win2 = win1.clone();
		win2.position.z=5.5;
		house.add(new T.Mesh(body,new T.MeshStandardMaterial({ map:t4,roughness:0.75})));
		house.add(win1);
		house.add(win2);
		house.add(wintexMesh);
		super('house1',house);
	}
}

export class House2 extends GrObject {
	constructor(params={}) {
		let t2 = new T.TextureLoader().load("./Texture/map.png");
		let house = new T.Object3D();
		const shape = new T.Shape();
		shape.moveTo(-1.5,0);
		shape.lineTo(2,0);
		shape.lineTo(2,5);
		shape.lineTo(-1.5,6.5);
		shape.lineTo(-1.5,0)
		const bodySettings = {
			depth: 7,
			bevelEnabled: false,
		};
		var broof  = new T.TextureLoader().load( "./Texture/roof.jpg", function ( texture ) {

			texture.wrapS = texture.wrapT = T.RepeatWrapping;
			texture.offset.set( 0, 0 );
			texture.repeat.set( 10, 10 );
		
		} );
		broof.wrapS = T.RepeatWrapping;
		broof.wrapT = T.RepeatWrapping;
		var sroof = new T.TextureLoader().load( "./Texture/roof.jpg", function ( texture ) {

			texture.wrapS = texture.wrapT = T.RepeatWrapping;
			texture.offset.set( 0, 0 );
			texture.repeat.set( 2, 2 );
		
		} );
		sroof.wrapS = T.RepeatWrapping;
		sroof.wrapT = T.RepeatWrapping;
		let wall = new T.TextureLoader().load("./Texture/wall.jpeg");
		wall.wrapS = T.RepeatWrapping;
		wall.wrapT = T.RepeatWrapping;
		let gdoor = new T.TextureLoader().load("./Texture/gardoor.jpeg");
		let win = new T.TextureLoader().load( "./Texture/window2.jpg", function ( texture ) {

			texture.wrapS = texture.wrapT = T.RepeatWrapping;
			texture.offset.set( 0, 0 );
			texture.rotation=-Math.PI/2;
			texture.repeat.set(0.2,0.2);
		} );
		let twofG = new T.ExtrudeGeometry(shape, bodySettings);
		let onefG = new T.BoxGeometry(6,3.5,11);
		
		let garG = new T.BoxGeometry(3,2.5,3);
		let garMat=[];
		garMat.push(
			new T.MeshBasicMaterial({map:gdoor}),//door
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),
			new T.MeshBasicMaterial({map:sroof}),
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),
		);
		// roof.repeat = new T.Vector2(1,1);
		let oneMat=[];
		oneMat.push(
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),//door
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),
			new T.MeshBasicMaterial({map:broof}),
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),
		);

		let twoMat=[];
		twoMat.push(
			new T.MeshStandardMaterial({map:wall,roughness:0.75}),//door
			new T.MeshStandardMaterial({map:win,roughness:0.75})
		);
			twofG.computeFaceNormals();
		let gar = new T.Mesh(garG, garMat);
		let onef = new T.Mesh(onefG, oneMat);
		let twof = new T.Mesh(twofG, twoMat);
		onef.position.set(1,1.75,2); 
		gar.position.set(4,1.25,-1); 
		house.add(twof);
		house.add(onef);
		house.add(gar);
		super('house2',house);
	}
}

export class Tree1 extends GrObject {
	constructor(params={}) {
		let tree = new T.Object3D();
		const verticesOfCube = [
			-1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
			-1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
		];
		const indicesOfFaces = [
			2, 1, 0,    0, 3, 2,
			0, 4, 7,    7, 3, 0,
			0, 1, 5,    5, 4, 0,
			1, 2, 6,    6, 5, 1,
			2, 3, 7,    7, 6, 2,
			4, 5, 6,    6, 7, 4,
		];
		const radius = 7;
		const detail = 2;
		const s1g = new T.PolyhedronGeometry(verticesOfCube, indicesOfFaces, radius, detail);
		s1g.computeFlatVertexNormals();
		s1g.scale(0.3,0.3,0.3);
		let s1m = new T.MeshLambertMaterial({color:'yellowgreen'});
		let s1 = new T.Mesh(s1g,s1m);
		s1m.flatShading = true;
		s1.position.y=4;
		let s2g = new T.TorusKnotGeometry(1.5, 0.5, 50, 8, 2, 3);
		s2g.rotateX(-Math.PI/2);
		let s2m = new T.MeshLambertMaterial({color:'yellowgreen'});
		let s2 = new T.Mesh(s2g,s2m);
		s2g.computeFlatVertexNormals();
		s2.position.set(0,4,0);
		s2m.flatShading = true;
		let trg = new T.ConeGeometry(0.6,4,7);
		let trm = new T.MeshLambertMaterial({color:'#654321'});
		let tr = new T.Mesh(trg,trm);
		let s2r = s2.clone();
		s2r.rotateZ(Math.PI/2);
		let s2rr = s2.clone();
		s2rr.rotateX(Math.PI/2);
		trg.computeFlatVertexNormals();
		tr.position.set(0,2,0);
		trm.flatShading = true;
		tree.add(s2);
		tree.add(tr);
		tree.add(s2r);
		tree.add(s2rr);
		super('tree1',tree);
	}
}

export class Tree2 extends GrObject {
	constructor(params={}) {
		let tree = new T.Object3D();
		let trg = new T.ConeGeometry(0.5,4,9);
		let trm = new T.MeshLambertMaterial({color:'#654321'});
		let tr = new T.Mesh(trg,trm);
		tr.position.y=2;
		let lvs = new T.MeshLambertMaterial({color:'#064000'});
		let lv1g = new T.ConeGeometry(1.8,0.7,8);
		let lv1 = new T.Mesh(lv1g,lvs);
		lv1.position.y=1.7;
		tree.add(lv1);
		let lv2g = new T.ConeGeometry(1.5,0.7,7);
		let lv2 = new T.Mesh(lv2g,lvs);
		lv2.position.y=2.3;
		let lv3g = new T.ConeGeometry(1.3,1.1,6);
		let lv3 = new T.Mesh(lv3g,lvs);
		lv3.position.y=3;
		tree.add(lv3);
		let lv4g = new T.ConeGeometry(0.8,1.2,5);
		let lv4 = new T.Mesh(lv4g,lvs);
		lv4.position.y=3.8;
		tree.add(lv4);
		tree.add(lv2);
		tree.add(tr);
		lv1g.computeFlatVertexNormals();
		lv2g.computeFlatVertexNormals();
		lv3g.computeFlatVertexNormals();
		super('tree1',tree);
	}
}

export function shift(grobj,x,y,z) {
	grobj.objects[0].translateX(x);
	grobj.objects[0].translateY(y);
	grobj.objects[0].translateZ(z);
}

export function rotate(grobj,y) {
    grobj.objects[0].rotateY(y);
}
// define your buildings here - remember, they need to be imported
// into the "main" program