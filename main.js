var config = window.config || window.parent.config || {

    //test data in case window.config isn't set (probably development?)
    surfaces: [
        {name: "Callosum Forceps Major", path:"testdata/surfaces/Callosum_Forceps_Major_surf.vtk"},
        {name: "Callosum Forceps Minor", path:"testdata/surfaces/Callosum_Forceps_Minor_surf.vtk"},
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
        {name: "Right Uncinate", path: "testdata/surfaces/Right_Uncinate_surf.vtk" },
    ]
}

Vue.component("controller", {
    props: [ "meshes" ],
    data: function() {
        return {
            rotate: false,
            para3d: false,
            all: true,
        }
    },
    methods: {
    },
    watch: {
        all() {
            this.meshes.forEach(_m=>{
                _m.mesh.visible = this.all;
            });
        },
        rotate() {
            this.$emit('rotate');
        },
        para3d() {
            this.$emit('para3d', this.para3d);
        },
    },
    template: `
        <div>
            <div class="control">
                <input type="checkbox" v-model="rotate"></input> Rotate</input>
                <input type="checkbox" v-model="para3d"></input> 3D</input>
            </div>
            <hr>
            <h3>Surfaces</h3>
            <div class="control">
                <input type="checkbox" v-model="all"></input> (All)</input>
            </div>
            <div class="control" v-for="_m in meshes">
                <input type="checkbox" v-model="_m.mesh.visible"></input> {{_m.name}}
            </div>
        </div>
    `,
});

function hashstring(s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}
var loader = new THREE.VTKLoader();

new Vue({
    el: "#app",
    template: `
        <div style="height: 100%; position: relative;">
            <controller v-if="controls" :meshes="meshes" @rotate="toggle_rotate()" id="controller" @para3d="set_para3d"/>
            <h2 id="loading" v-if="toload > 0">Loading <small>({{toload}})</small>...</h2>
            <div ref="main" class="main"></div>
        </div>
    `,
    components: [ "controller" ],
    data() {
        return {
            toload: 0,

            //main components
            effect: null,
            scene: null, 
            camera: null,
            renderer: null,
            controls: null,

            //loaded meshes
            meshes: [],
        }
    },
    mounted() {
        var width = this.$refs.main.clientWidth;
        var height = this.$refs.main.clientHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x333333);

        this.camera = new THREE.PerspectiveCamera( 45, width / height, 1, 5000);
        this.renderer = new THREE.WebGLRenderer();

        //https://github.com/mrdoob/three.js/blob/master/examples/webgl_effects_parallaxbarrier.html
        this.effect = new THREE.ParallaxBarrierEffect( this.renderer );
        this.effect.setSize( width, height );
        
        this.$refs.main.append(this.renderer.domElement);
        this.camera.position.z = 200;
        this.scene.add(this.camera);

        var amblight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(amblight);
        var dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight.position.set(2000, 2000, 5000).normalize();
        this.scene.add(dirLight);
        var pointLight = new THREE.PointLight(0xffffff, 0.7);
        pointLight.position.set(-2000, 2000, -5000);
        this.scene.add(pointLight);
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        window.addEventListener("resize", this.resize);
        this.resize();
        this.animate();
        
        //start loading surfaces geometries
        this.toload = config.surfaces.length;
        async.eachLimit(config.surfaces, 3, (surface, next_surface) => {
            if(!surface.path) {
                console.error("path not set on surface object");
                console.dir(surface);
                this.toload--;
                return;
            }
            loader.load(surface.path, geometry=>{
                this.toload--;
                this.add_surface(surface.name, geometry);
                next_surface();
            });
        });
    },

    methods: {
        resize() {
            var width = this.$refs.main.clientWidth;
            var height = this.$refs.main.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            this.effect.setSize( width, height );
        },

        set_para3d(it) {
            this.para3d = it;
        },

        animate() {
            requestAnimationFrame(this.animate);
            this.controls.update();
            if(this.para3d) {
                this.effect.render(this.scene, this.camera);
            } else {
                this.renderer.render(this.scene, this.camera);
            }
        },

        add_surface(name, geometry) {
            geometry.computeVertexNormals();
            name = name.replace("_", " ");
            hname = name.replace("Left", "");
            hname = hname.replace("Right", "");
            var hash = hashstring(hname);
            var material = new THREE.MeshPhongMaterial({color: new THREE.Color(hash)});
            var mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x += Math.PI / 2;
            mesh.position.x -= 100; //rigith/left
            mesh.position.y += 100; //s/i
            mesh.position.z -= 100; //a/p
            this.meshes.push({name, mesh});
            this.scene.add(mesh);
        },

        toggle_rotate() {
            this.controls.autoRotate = !this.controls.autoRotate;
        },
    },
});






