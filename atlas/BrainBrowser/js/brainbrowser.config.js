/* 
 * Copyright (C) 2011 McGill University
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  "use strict";
  
  BrainBrowser.config = {

    surface_viewer: {

      worker_dir: "js/brainbrowser/workers/",

      filetypes: {
        MNIObject: {
          worker: "mniobj.worker.js",
        },
        WavefrontObj: {
          worker: "wavefront_obj.worker.js"
        },
        FreeSurferAsc: {
          worker: "freesurfer_asc.worker.js",
          format_hint: 'You can use <a href="http://surfer.nmr.mgh.harvard.edu/fswiki/mris_convert" target="_blank">mris_convert</a> to convert your binary surface files into .asc format.'
        }
      },

      color_maps: [
        {
          name: "Spectral",
          url: "color_maps/spectral.txt",
        },
        {
            name: "jet",
            url: "color_maps/jet.txt",
        },
        {
          name: "Thermal",
          url: "color_maps/thermal.txt",
        },
		{
          name: "Hot",
          url: "color_maps/hot.txt",
        },
		{
          name: "Lightspect",
          url: "color_maps/lightspect.txt",
        },
        {
          name: "Gray",
          url: "color_maps/gray_scale.txt",
        },
        {
          name: "Blue",
          url: "color_maps/blue.txt",
        },
		{
          name: "Green",
          url: "color_maps/green.txt",
        }
      ]

    },

    volume_viewer: {
      color_maps: [
        {
          name: "Spectral",
          url: "color_maps/spectral-brainview.txt",
          cursor_color: "#FFFFFF"
        },
        {
            name: "jet",
            url: "color_maps/jet.txt",
            cursor_color: "#FFFFFF"
        },
        {
          name: "Thermal",
          url: "color_maps/thermal.txt",
          cursor_color: "#FFFFFF"
        },
        {
          name: "Gray",
          url: "color_maps/gray_scale.txt",
          cursor_color: "#FF0000"
        },
        {
          name: "Blue",
          url: "color_maps/blue.txt",
          cursor_color: "#FFFFFF"
        },
        {
          name: "Green",
          url: "color_maps/green.txt",
          cursor_color: "#FF0000"
        }
      ]
    }
    
  }
})();


