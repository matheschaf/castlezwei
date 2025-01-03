<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
</head>
<body>
    <canvas id="renderCanvas" style="width: 100%; height: 100vh;"></canvas>
    <script>
        // Get the canvas element
        const canvas = document.getElementById('renderCanvas');

        // Generate the BABYLON 3D engine
        const engine = new BABYLON.Engine(canvas, true);

        // Create the scene space
        const createScene = () => {
            const scene = new BABYLON.Scene(engine);

            // Add a camera to the scene and attach it to the canvas
            const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 3, 20, new BABYLON.Vector3(0, 1, 0), scene);
            camera.attachControl(canvas, true);

            // Add lights to the scene
            const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

            // Set position offset
            const offset = new BABYLON.Vector3(2, 0, 2);

            // Create a small red sphere at the reference point
            const referenceSphere = BABYLON.MeshBuilder.CreateSphere("referenceSphere", { diameter: 0.5 }, scene);
            referenceSphere.position = offset;
            const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
            sphereMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color
            referenceSphere.material = sphereMaterial;

            // Material for the towers and building
            const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
            towerMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Grey color
            towerMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/bricktile.jpg", scene);

            // Round Tower
            const roundTower = BABYLON.MeshBuilder.CreateCylinder("roundTower", { diameter: 2, height: 6 }, scene);
            roundTower.position = offset.add(new BABYLON.Vector3(-5, 3, 0));
            roundTower.material = towerMaterial;

            // Square Tower
            const squareTower = BABYLON.MeshBuilder.CreateBox("squareTower", { width: 3, height: 6, depth: 3 }, scene);
            squareTower.position = offset.add(new BABYLON.Vector3(5, 3, 0));
            squareTower.material = towerMaterial;

            // Building
            const building = BABYLON.MeshBuilder.CreateBox("building", { width: 6, height: 4, depth: 4 }, scene);
            building.position = offset.add(new BABYLON.Vector3(0, 2, 5));
            building.material = towerMaterial;

            return scene;
        };

        // Create the scene
        const scene = createScene();

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener('resize', () => {
            engine.resize();
        });
    </script>
</body>
</html>
