/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'
import { GUI, GUIController } from 'dat.gui'


export class ExampleApp extends gfx.GfxApp
{   
    private cameraControls: gfx.OrbitControls;
    private cylinder: gfx.Mesh3;

    private gui: GUI;
    public wireframe: boolean;


    // --- Create the ExampleApp class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

        this.wireframe = true;
        this.gui = new GUI({ width: 300, closed: false });
        this.gui.add(this, 'wireframe')
            .onChange((value) => {
                this.wireframe = value;
                if (this.wireframe) {
                    this.cylinder.material = new gfx.WireframeMaterial();
                } else {
                    this.cylinder.material = new gfx.PhongMaterial();
                }
            });
        this.cameraControls = new gfx.OrbitControls(this.camera);
        this.cylinder = new gfx.Mesh3();
    }

    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        // Setup camera
        this.camera.setPerspectiveCamera(60, 1920/1080, 0.1, 10);
        this.cameraControls.setDistance(5);

        // Set a black background
        this.renderer.background.set(0, 0, 0);
        
        // Create an ambient light
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.25, 0.25, 0.25));
        this.scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new gfx.DirectionalLight(new gfx.Color(0.5, 0.5, 0.5));
        directionalLight.position.set(-2, 1, 0)
        this.scene.add(directionalLight);

        // Add an axes display to the scene
        const axes = gfx.Geometry3Factory.createAxes(4);
        this.scene.add(axes);

        this.cylinder = this.createCylinderMesh();
        this.scene.add(this.cylinder);
    }

    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        this.cameraControls.update(deltaTime);
    }

    private createCylinderMesh(): gfx.Mesh3
    {
        const mesh: gfx.Mesh3 = new gfx.Mesh3();
        const vertices: gfx.Vector3[] = [];
        const normals: gfx.Vector3[] = [];
        const indices: number[] = [];

        // TODO: Fill in the vertices and indices arrays

        const numSegments = 25;
        const angleInc = -2.0 * Math.PI / numSegments;
        const rad = 0.5;
        const height = 2;

        // first create the vertices
        for (let i=0; i<=numSegments; i++) {
            const x = rad * Math.cos(i*angleInc);
            const z = rad * Math.sin(i*angleInc);
            const n = gfx.Vector3.normalize(new gfx.Vector3(x, 0, z));
            
            vertices.push(new gfx.Vector3(x,height/2,z));
            normals.push(n);

            vertices.push(new gfx.Vector3(x,-height/2,z));
            normals.push(n);
        }

        // now create the indices
        for (let i=0; i < numSegments; i++) {
            indices.push(2*i);    // 0, 2, 4
            indices.push(2*i+1);  // 1, 3, 5
            indices.push(2*i+2);  // 2, 4, 6

            indices.push(2*i+1);      // 1, 3
            indices.push(2*(i+1)+1);  // 3, 5
            indices.push(2*(i+1));    // 2, 4
        }

        /**
        vertices.push(new gfx.Vector3(0,1,0));
        vertices.push(new gfx.Vector3(0,0,0));
        vertices.push(new gfx.Vector3(1,1,0));
        vertices.push(new gfx.Vector3(1,0,0));

        indices.push(0);
        indices.push(1);
        indices.push(2);

        indices.push(1);
        indices.push(3);
        indices.push(2);
        **/

        mesh.setVertices(vertices);
        mesh.setNormals(normals);
        mesh.setIndices(indices);
        return mesh;
    }
}
