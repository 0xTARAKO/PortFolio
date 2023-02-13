export class Canvas {
    constructor() {

        this.cvs = document.createElement('canvas')
        this.ctx = this.cvs.getContext('2d')
        this.ctx.textAlign = 'center'
        this.texture = new THREE.CanvasTexture( this.cvs )

        this.canvas = document.getElementById('canvas')
        this.canvas.width = innerWidth
        this.canvas.height = innerHeight

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
        this.fps.position.set( 0 , 0 , 0 )

        this.tps = new THREE.PerspectiveCamera( 50 , innerWidth / innerHeight , 0.1 , 50000 )
        this.tps.position.set( 0 , 0 , 10 )

        this.orbit = new THREE.OrbitControls( this.tps , this.canvas )
        this.orbit.target.set( 0 , 0 , 0 )
        this.orbit.minDistance = 1
        

        this.light = new THREE.HemisphereLight( 0xffffbb , 0x080820 , 1 )

        new THREE.GLTFLoader().load( '../img/men.glb' , gltf => {
            this.model = gltf.scene
            this.model.position.set( 0 , -1 , 0 )
            this.model.children[0].children[0].material = new THREE.MeshStandardMaterial({
                color : new THREE.Color(`hsl(${Math.random()*360} , 100% , 50% )`) ,
                metalness : 1.00 ,
                roughness : 0.28 ,
                envMap : this.envMap
            })
            this.model.children[0].children[1].material = new THREE.MeshStandardMaterial({
                color : 0xFFFFFF ,
                metalness : 1.00 ,
                roughness : 0.00 ,
                envMap : this.envMap
            })
            this.model.children[0].children[2].material = new THREE.MeshBasicMaterial({
                map : new THREE.TextureLoader().load('../img/air.png') ,
                color : 0xFFFFFF ,
                transparent: true ,
                blending: THREE.AdditiveBlending ,
                side: THREE.DoubleSide ,
                depthWrite: false ,
                opacity : 0
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

        this.planet = new THREE.Mesh(
            new THREE.SphereGeometry( 5 , 64 , 64 ),
            new THREE.MeshNormalMaterial()
        )
        this.planet.position.set( 0 , 0 , -20 )

        this.scene.add( this.light , this.planet )

        this.data = {
            camera : false ,
            front : false , 
            back : false ,
            left : false ,
            right : false ,
            up : false ,
            down : false ,
            prevTime : performance.now() ,
            time : undefined ,
            delete : undefined ,
            velocity : new THREE.Vector3() ,
            direction : new THREE.Vector3() ,
            vector : new THREE.Vector3() ,
            euler : new THREE.Euler( 0 , 0 , 0 , 'YXZ')
        }
        
        this.Animate()
    }
    Control( event ) {
        if( event.type === 'keydown' ) {
            if( event.code === 'KeyW' ) this.data.front = true
            if( event.code === 'KeyA' ) this.data.left = true
            if( event.code === 'KeyS' ) this.data.back = true
            if( event.code === 'KeyD' ) this.data.right = true
            if( event.code === 'KeyC' ) this.data.down = true
            if( event.code === 'KeyV' ) this.data.up = true
            this.model.children[0].children[2].material.opacity = 1
        }
        if( event.type === 'keyup' ) {
            if( event.code === 'KeyW' ) this.data.front = false
            if( event.code === 'KeyA' ) this.data.left = false
            if( event.code === 'KeyS' ) this.data.back = false
            if( event.code === 'KeyD' ) this.data.right = false
            if( event.code === 'KeyC' ) this.data.down = false
            if( event.code === 'KeyV' ) this.data.up = false
            if( event.key === 'Control' ) {
                if( this.data.camera ) {
                    this.data.camera = false
                    document.exitPointerLock()
                    document.getElementById('fps').hidden = true
                    document.getElementById('tps').hidden = false
                }
                else {
                    this.data.camera = true
                    document.body.requestPointerLock()
                    document.getElementById('fps').hidden = false
                    document.getElementById('tps').hidden = true
                }
            }
        }
        if( event.type === 'mousemove' && this.data.camera === true ) {
			this.data.euler.setFromQuaternion( this.model.quaternion )
			this.data.euler.y -= event.movementX * 0.001
			this.data.euler.x -= event.movementY * 0.001
			this.data.euler.x = Math.max( -Math.PI / 2 , Math.min( Math.PI / 2 , this.data.euler.x ))
			this.model.quaternion.setFromEuler( this.data.euler )
        }
    }
    MoveX( distance ) {
        this.data.vector.setFromMatrixColumn( this.model.matrix , 0 )
        this.model.position.addScaledVector( this.data.vector , distance )
    }
    MoveZ( distance ) {
        this.data.vector.setFromMatrixColumn( this.model.matrix , 0 )
        this.data.vector.crossVectors( this.model.up , this.data.vector )
        this.model.position.addScaledVector( this.data.vector , distance )
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
        this.data.delete = ( this.data.time - this.data.prevTime ) / 20000

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
            this.MoveX( -this.data.velocity.x * this.data.delete )
            this.MoveZ( -this.data.velocity.z * this.data.delete )
            this.model.position.y -= this.data.velocity.y * this.data.delete
            if( this.model.children[0].children[2].material.opacity >= 0 ) {
                this.model.children[0].children[2].material.opacity -= this.model.children[0].children[2].material.opacity * 0.1
            }
        }

        this.data.camera ? this.renderer.render( this.scene , this.fps ) : this.renderer.render( this.scene , this.tps )

        this.orbit.update()

        if( this.object ) this.object.children[2].material.map.needsUpdate = true

        this.data.prevTime = this.data.time
    }
}