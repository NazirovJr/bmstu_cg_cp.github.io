(() => {
  var startTime = performance.now()
  // Configuration of different settings & user interaction handlers for the same
  window.menuConfig = {
    puzzles: {
      tetrahedron: (size, isDemo, color) =>
        new Tetrahedron(size, isDemo ? 42.5 : undefined, color),
      cube: (size, isDemo, color) => new Cube(size, isDemo ? 50 : undefined, color),
      octahedron: (size, isDemo, color) =>
        new Octahedron(size, isDemo ? 42.5 : undefined, color),
      dodecahedron: (size, isDemo, color) =>
        new Dodecahedron(size, isDemo ? 42.5 : undefined, color),
      icosahedron: (size, isDemo, color) =>
        new Icosahedron(size, isDemo ? 42.5 : undefined, color),
    },
    sizes: {
      tetrahedron: [3, 4, 5],
      cube: [2, 3, 4],
      octahedron: [2, 3, 4],
      dodecahedron: [1, 2, 3],
      icosahedron: [2, 3, 4],
    },
    colors: {
      tetrahedron: ["#000000", "#0021C9",
        "#99FF33", "#DF1001"],
      cube: ["#FFFF04", "#FFFFFF", "#0468FF",
        "#99FF33", "#DF1001", "#ff8c00"],
      octahedron: [
        "#FFFFFF", "#0468FF", "#99FF33", "#87ceeb",
        "#DF1001", "#ff8c00", "#800080", "#FFFF04"
      ],
      dodecahedron: ["#800080", "#ff00ff",
        "#FFFFFF", "#FFFF04", "#ffc0cb", "#0468FF", "#008000",
        "#dc143c", "#DF1001",
        "#99FF33", "#a52a2a", "#049AFF"],
      icosahedron: [
        "#FFFFFF", "#0468FF", "#DF1001",
        "#99FF33", "#87ceeb", "#ffa500",
        "#556b2f", "#FFFF04", "#90ee90", "#fa8072",
        "#ff00ff", "#dc143c", "#4b0082",
        "#a52a2a", "#00008b",
        "#ffc0cb", "#deb887", "#008b8b",
        "#8b008b","#daa520"],
    }
  };

  let menuStateCounter = 0;

  window.showShapeMenu = () => {
    menuStateCounter++;
    window.puzzlemenu.style.display = window.shapemenu.style.display = window.settingsmenubutton.style.display =
      "inline-block";
    window.configurationmenu.style.display = window.puzzlemenubutton.style.display = window.sizemenu.style.display =
      "none";
    const localState = menuStateCounter;
    for (const elemId in window.menuConfig.puzzles) {
      const ctx = window[elemId].getContext("2d");
      const constructor = window.menuConfig.puzzles[elemId];
      const puzzle = constructor(undefined, true);
      puzzle.updatedOrientation = {
        axis: new Vector({ x: 1, y: 1, z: 0 }),
        angle: 0,
      };
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(50, 50);
      const animationFPSThrottler = createAnimationFPSThrottler();
      const loop = () => {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.restore();
        puzzle.updatedOrientation.angle += 0.015;
        puzzle.update();
        puzzle.render(ctx);
        if (menuStateCounter === localState) {
          animationFPSThrottler.requestAnimationFrame(loop);
        }
      };
      animationFPSThrottler.requestAnimationFrame(loop);

      window[elemId].onmousedown = () => showSizeMenu(elemId);
    }
  };

  window.showSizeMenu = (elemId) => {
    menuStateCounter++;
    const localState = menuStateCounter;
    window.shapemenu.style.display = window.settingsmenubutton.style.display =
      "none";
    window.sizemenu.style.display = window.puzzlemenubutton.style.display =
      "inline";
    window.settingsmenubutton.style.display="inline-block";

    for (let i = 0; i < 3; i++) {
      const ctx = window[`size-${i + 1}`].getContext("2d");
      const constructor = window.menuConfig.puzzles[elemId];
      const puzzleSize = window.menuConfig.sizes[elemId][i];
      const puzzleColor = window.menuConfig.colors[elemId];
      const puzzle = constructor(puzzleSize, true, puzzleColor);
      puzzle.updatedOrientation = {
        axis: new Vector({ x: 1, y: 1, z: 0 }),
        angle: 0,
      };
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(50, 50);
      animationFPSThrottler = createAnimationFPSThrottler();
      const loop = () => {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.restore();
        puzzle.updatedOrientation.angle += 0.015;
        puzzle.update();
        puzzle.render(ctx);
        if (menuStateCounter === localState) {
          animationFPSThrottler.requestAnimationFrame(loop);
        }
      };
      animationFPSThrottler.requestAnimationFrame(loop);

      window[`size-${i + 1}`].onmousedown = () => {
        window.clearSolution();
        window.chooseColor();
        window.selectedPuzzle = constructor(puzzleSize, false, puzzleColor);
        window.showStartButton();
      };
    }
  };

  window.showSettingsMenu = () => {
    window.puzzlemenu.style.display = window.settingsmenubutton.style.display =
      "none";
    window.configurationmenu.style.display = window.puzzlemenubutton.style.display =
      "inline";
  };

  window.backHandler = () => {
    if (window.settingsmenubutton.style.display === 'none') {
      window.puzzlemenu.style.display=settingsmenubutton.style.display='inline-block';
      window.configurationmenu.style.display=puzzlemenubutton.style.display='none';
      window.question.style.display=question.style.display='inline-block';
      window.puzzlemenubutton.style.display = 'inline';
    } else {
      showShapeMenu()
    }
  }

  window.hideStartButton = () => {
    window.startbutton.style.visibility = "hidden";
  };

  window.showStartButton = () => {
    window.startbutton.style.visibility = "visible";
  };

  window.configMenu = () => {
    window.puzzlemenu.style.display=settingsmenubutton.style.display='inline-block';
    window.configurationmenu.style.display=puzzlemenubutton.style.display='none';
    window.question.style.display=question.style.display='inline-block';
    window.puzzlemenubutton.style.display = 'inline';

    selectedPuzzle.faces.forEach((el,i) => {
      console.log( document.getElementById(`face${i}`).value)
      el.stickers.forEach(item => item.colorData.code = document.getElementById(`face${i}`).value)
    })
  }

  window.chooseColor =  () => {
    setTimeout(()=>{
      string = []
       selectedPuzzle.faces.forEach((el,i) => {
         string.push(`<div id = ${"faceDiv" + (i + 1)}><input type="color" id="face${i}" name="head" value="${el.stickers[0].colorData.code}"><label for="head">&nbsp Грань ${i + 1}&nbsp&nbsp</label></div><br/>`)
      })
      window.choosecolor.innerHTML = string.join(" ")
    }, 1000)
  }

  window.showShapeMenu();
  window.chooseColor();
  var endTime = performance.now()
  console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
})();
