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
        this.renderer.setClearColor( 0x000011 , 1 )
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.pmremGenerator = new THREE.PMREMGenerator( this.renderer )
        this.pmremGenerator.compileEquirectangularShader()
        this.envMap = new THREE.TextureLoader().load( '../img/texture.png' , map => {
            this.envMap = this.pmremGenerator.fromEquirectangular( map ).texture
            this.pmremGenerator.dispose()
        })

        this.fps = new THREE.PerspectiveCamera( 50 , innerWidth / innerHeight , 0.1 , 50000 )
        this.fps.position.set( 0 , 0.5 , 2 )

        this.tps = new THREE.PerspectiveCamera( 50 , innerWidth / innerHeight , 0.1 , 50000 )
        this.tps.position.set( 0 , 0 , -2 )

        this.orbit = new THREE.OrbitControls( this.tps , this.canvas )
        this.orbit.target.set( 0 , 0 , 0 )
        this.orbit.minDistance = 1
        

        this.light = new THREE.HemisphereLight( 0xffffbb , 0x080820 , 1 )

        new THREE.GLTFLoader().load( '../img/men.glb' , gltf => {
            this.model = gltf.scene
            this.model.position.set( 0 , 0 , 10 )
            this.model.children[0].children[0].material = new THREE.MeshStandardMaterial({
                color : 0xFF9933 ,
                metalness : 1.00 ,
                roughness : 0.18 ,
                envMap : this.envMap
            })
            this.model.children[0].children[1].material = new THREE.MeshStandardMaterial({
                color : 0xFFFFFFF ,
                metalness : 1.00 ,
                roughness : 0.05 ,
                envMap : this.envMap
            })
            this.model.add( this.fps )
            this.scene.add( this.model )
        })

        new THREE.GLTFLoader().load( '../img/object.glb' , gltf => {
            this.object = gltf.scene
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
            camera : true ,
            front : false , 
            back : false ,
            left : false ,
            right : false ,
            prevTime : performance.now() ,
            time : undefined ,
            delete : undefined ,
            velocity : new THREE.Vector3() ,
            direction : new THREE.Vector3() ,
            vertex : new THREE.Vector3() ,
        }
        
        this.Animate()
    }
    Control( event ) {
        if( event.type === 'keydown' ) {
            if( event.code === 'KeyW' ) this.data.front = true
            if( event.code === 'KeyA' ) this.data.left = true
            if( event.code === 'KeyS' ) this.data.back = true
            if( event.code === 'KeyD' ) this.data.right = true
            if( event.code === 'KeyC' ) this.data.right = true
            if( event.code === 'KeyV' ) this.data.right = true
            if( event.code === 'Escape' ) this.data.camera = false
        }
        if( event.type === 'keyup' ) {
            if( event.code === 'KeyW' ) this.data.front = false
            if( event.code === 'KeyA' ) this.data.left = false
            if( event.code === 'KeyS' ) this.data.back = false
            if( event.code === 'KeyD' ) this.data.right = false
            if( event.code === 'KeyC' ) this.data.right = false
            if( event.code === 'KeyV' ) this.data.right = false
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

        this.data.time = performance.now()
        this.data.delete = ( this.data.time - this.data.prevTime ) / 10000

        if( this.model ) {
            this.data.velocity.x -= this.data.velocity.x * 10.0 * this.data.delete
            this.data.velocity.y -= this.data.velocity.y * 10.0 * this.data.delete
            this.data.velocity.z -= this.data.velocity.z * 10.0 * this.data.delete
            this.data.direction.x = Number( this.data.right ) - Number( this.data.left )
            this.data.direction.y = Number( this.data.up ) - Number( this.data.down )
            this.data.direction.z = Number( this.data.front ) - Number( this.data.back )
            this.data.direction.normalize()
            if( this.data.right || this.data.left ) this.data.velocity.x -= this.data.direction.x * 400 * this.data.delete
            if( this.data.up || this.data.down ) this.data.velocity.y -= this.data.direction.y * 400 * this.data.delete
            if( this.data.front || this.data.back ) this.data.velocity.z -= this.data.direction.z * 400 * this.data.delete
            this.model.position.x -= this.data.velocity.x * this.data.delete
            this.model.position.y -= this.data.velocity.y * this.data.delete
            this.model.position.z += this.data.velocity.z * this.data.delete
        }

        this.data.camera ? this.renderer.render( this.scene , this.fps ) : this.renderer.render( this.scene , this.tps )

        this.orbit.update()

        if( this.object ) this.object.children[2].material.map.needsUpdate = true

        this.data.prevTime = this.data.time
    }
}