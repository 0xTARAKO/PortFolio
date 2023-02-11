export class Canvas {
    constructor() {
        this.cvs = document.createElement('canvas')
        this.ctx = this.cvs.getContext('2d')
        this.ctx.textAlign = 'center'
        this.texture = new THREE.CanvasTexture( this.cvs )

        this.canvas = document.createElement('canvas')
        this.canvas.width = innerWidth
        this.canvas.height = innerHeight
        document.body.prepend( this.canvas )

        this.scene = new THREE.Scene()
        
        this.renderer = new THREE.WebGLRenderer({ canvas : this.canvas , antialias : true })
        this.renderer.setSize( innerWidth , innerHeight )
        this.renderer.setPixelRatio( devicePixelRatio )
        this.renderer.setClearColor( 0x010101 , 1 )
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.pmremGenerator = new THREE.PMREMGenerator( this.renderer )
        this.pmremGenerator.compileEquirectangularShader()
        this.envMap = new THREE.TextureLoader().load( '../img/texture.png' , map => {
            this.envMap = this.pmremGenerator.fromEquirectangular( map ).texture
            this.pmremGenerator.dispose()
        })

        this.fps = new THREE.PerspectiveCamera( 50 , innerWidth / innerHeight , 0.1 , 50000 )

        this.tps = new THREE.PerspectiveCamera( 50 , innerWidth / innerHeight , 0.1 , 50000 )
        this.tps.position.set( 0 , 0 , -2 )

        this.orbit = new THREE.OrbitControls( this.tps , this.canvas )
        this.orbit.target.set( 0 , 0 , 0 )
        this.orbit.minDistance = 0.5
        this.orbit.maxDistance = 5
        console.log( this.orbit )
        

        this.light = new THREE.HemisphereLight( 0xffffbb , 0x080820 , 1 )

        new THREE.GLTFLoader().load( '../img/men.glb' , gltf => {
            this.model = gltf.scene
            this.model.children[0].children[0].material = new THREE.MeshStandardMaterial({
                color : 0xFF9933 ,
                metalness : 1.00 ,
                roughness : 0.18 ,
                envMap : this.envMap
            })
            this.model.children[0].children[1].material = new THREE.MeshStandardMaterial({
                color : 0xFFFFFFF ,
                metalness : 1.00 ,
                roughness : 0.00 ,
                envMap : this.envMap
            })
            this.model.add( this.tps )
            this.scene.add( this.model )
        })

        new THREE.GLTFLoader().load( '../img/object.glb' , gltf => {
            this.object = gltf.scene
            this.object.position.set( 0 , -2 , 2 )
            console.log( this.object.children[2] )
            this.object.children.forEach( child => {
                child.children.forEach( ren => {
                    ren.material.envMap = this.envMap
                })
            })
            this.object.children[2].material = new THREE.MeshStandardMaterial({
                map : this.texture
            })
            this.scene.add( this.object )
        })

        this.scene.add( this.light )

        this.data = {
            camera : false ,
            pos : new THREE.Vector3( 0 , 0 , 0 )
        }
    }
    Resize() {
        this.canvas.width = innerWidth
        this.canvas.height = innerHeight
        this.renderer.setSize( innerWidth , innerHeight )
        this.renderer.setPixelRatio( devicePixelRatio )
        this.tps.aspect = innerWidth / innerHeight
        this.tps.updateProjectionMatrix()
    }
    Animate() {
        requestAnimationFrame( this.Animate.bind( this ) )

        this.data.cam ? this.renderer.render( this.scene , this.fps ) : this.renderer.render( this.scene , this.tps )

        this.orbit.update()
        this.orbit.target0.set( this.data.pos )

        if( this.object ) this.object.children[2].material.map.needsUpdate = true
    }
}