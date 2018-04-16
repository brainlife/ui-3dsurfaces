var config = window.config || window.parent.config || {
    surfaces: [
        {name: "Callosum Forceps Major", path:"testdata/surfaces/Callosum_Forceps_Major_surf.vtk"},
        {name: "Callosumx Forceps Minor", path:"testdata/surfaces/Callosum_Forceps_Minor_surf.vtk"},
        {name: "Left Arcuate", path:"testdata/surfaces/Left_Arcuate_surf.vtk"},
        {name: "Left Cingulum Cingulate", path:"testdata/surfaces/Left_Cingulum_Cingulate_surf.vtk"},
        {name: "Left Corticospinal", path:"testdata/surfaces/Left_Corticospinal_surf.vtk"},
        {name: "Left IFOF", path:"testdata/surfaces/Left_IFOF_surf.vtk"},
        {name: "Left ILF", path:"testdata/surfaces/Left_ILF_surf.vtk"},
        {name: "Left SLF", path:"testdata/surfaces/Left_SLF_surf.vtk"},
        {name: "Left Thalamic Radiation", path: "testdata/surfaces/Left_Thalamic_Radiation_surf.vtk"},
        {name: "Left Uncinate", path: "testdata/surfaces/Left_Uncinate_surf.vtk" },
        {name: "Right Arcuate", path: "testdata/surfaces/Right_Arcuate_surf.vtk "},
        {name: "Right Cingulum Cingulate", path: "testdata/surfaces/Right_Cingulum_Cingulate_surf.vtk" },
        {name: "Right Cingulum Hippocampus", path: "testdata/surfaces/Right_Cingulum_Hippocampus_surf.vtk" },
        {name: "Right Corticospinal", path: "testdata/surfaces/Right_Corticospinal_surf.vtk" },
        {name: "Right IFOF", path: "testdata/surfaces/Right_IFOF_surf.vtk" },
        {name: "Right ILF", path: "testdata/surfaces/Right_ILF_surf.vtk" },
        {name: "Right SLF", path: "testdata/surfaces/Right_SLF_surf.vtk" },
        {name: "Right Thalamic Radiation", path: "testdata/surfaces/Right_Thalamic_Radiation_surf.vtk" },
        {nane: "Right Uncinate", path: "testdata/surfaces/Right_Uncinate_surf.vtk" },
    ]
}

Vue.component("soichi", {
    data: function() {
        return {
            name: "soichi",
        }
    },
    template: '<b>{{name}}</b>',
});

function hashstring(s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}

new Vue({
    el: "#app",
    template: `
        <div style="height: 100%; position: relative;">
            <h1 style="position: absolute;">Surfaces</h1>
            <div ref="main" class="main"></div>
        </div>
    `,
    components: [ "soichi" ],
    data() {
        return {
            //var views = document.getElementById("views");
            surfaces: [], //surface scenes

            //main components
            scene: null, 
            camera: null,
            renderer: null,
            controls: null,
        }
    },
    mounted: function() {
        //TODO update to make it look like
        //view-source:https://threejs.org/examples/webgl_multiple_elements.html

        console.log("loading surfaces");

        //init..
        this.scene = new THREE.Scene();
        //scene.background = new THREE.Color(0x0000ff);
        this.camera = new THREE.PerspectiveCamera( 45, this.$refs.main.clientWidth / this.$refs.main.clientHeight, 1, 5000);
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        this.renderer.setSize(this.$refs.main.clientWidth, this.$refs.main.clientHeight);
        this.$refs.main.append(this.renderer.domElement);
       
        //camera
        this.camera.position.z = 200;
        this.scene.add(this.camera);
        
        /*
        //light (why adding to camera?)
        var amblight = new THREE.AmbientLight(0x101010);
        this.camera.add(amblight);
        */

        var dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(200, 200, 1000).normalize();
        this.camera.add(dirLight);
        this.camera.add(dirLight.target);
        
        //controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.addEventListener('change', function(e) {
            //rotation changes
        });
        this.controls.addEventListener('start', function(){
            //use interacting with control
            //gamma_input_el.trigger({type: "blur"});
            //controls.autoRotate = false;
        });

        //event handlers
        window.addEventListener("resize", ()=>{
            this.camera.aspect = this.$refs.main.clientWidth / this.$refs.main.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.$refs.main.clientWidth, this.$refs.main.clientHeight);
            this.controls.handleResize();
        });

        this.animate();
        
        //test
        var geometry = new THREE.BoxGeometry( 50, 50, 25 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );
        
        //start loading surfaces geometries
        var loader = new THREE.VTKLoader();
        config.surfaces.forEach(surface=>{
            loader.load(surface.path, geometry=>{
                this.create_scene(surface.name, geometry);
            });
        });
    },
    methods: {
        animate: function() {
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        },

        create_scene: function(view_name, geometry) {
            console.log(view_name, geometry);

            var scene = new THREE.Scene();
            this.scene.add(this.camera);
            
            geometry.computeVertexNormals();
            //geometry.center();
            //var hash = hashstring(view_name);
            //var material = new THREE.MeshLambertMaterial({color: new THREE.Color(hash)}); 
            var material = new THREE.MeshLambertMaterial({color: new THREE.Color(0x6666ff)}); 
            var mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x += Math.PI / 2;
            mesh.position.x -= 100; //rigith/left
            mesh.position.y += 100; //s/i
            mesh.position.z -= 100; //a/p
            
            scene.add(mesh);
            this.surfaces.push(scene);
        }
    },
});






