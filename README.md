[![Abcdspec-compliant](https://img.shields.io/badge/ABCD_Spec-v1.1-green.svg)](https://github.com/brain-life/abcd-spec)

# ui-3dsurfaces 

This app takes a configured list of URLs for VTK files and renderes it using WebGL. This app is used by Brainlife to show `neuro/3dsurfaces` datasets.
![screenshot](screenshot.png)
Take a look at this [demo](https://brainlife.io/ui/surfaces/)

### Authors
- Soichi Hayashi (hayashis@iu.edu)

### Contributors
- Steven O'Riley (stevengeeky@gmail.com)

### Project Director
- Franco Pestilli (franpest@indiana.edu)

### Funding 
[![NSF-BCS-1734853](https://img.shields.io/badge/NSF_BCS-1734853-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1734853)
[![NSF-IIS-1636893](https://img.shields.io/badge/NSF_IIS-1636893-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1636893)

### References 
TBA

## Prerequiste

```
sudo apt install nodejs
sudo npm install -g lite-server
```

## Installation

```
git clone https://github.com/brain-life/ui-3dsurfaces.git
cd ui-3dsurfaces
npm install
npm run dev
```

Your browser should open a ui-3dsurfaces viewer with data from ./testdata directory. Please see `index.html` to find out how to set paths for input data. and `testdata` for how to format the input data.
