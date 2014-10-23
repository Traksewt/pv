Coloring Molecular Structures
============================================================================


This document describes how a molecular structure's color can be controlled. 

The coloring scheme can be specified when generating the render geometry, e.g. when using one of the :ref:`render <pv.viewer.rendering>`. functions. Coloring can also be changed later on using the :func:`BaseGeom.colorBy` function. The latter also allows to apply coloring to subparts of the structure only. These two different ways to control the coloring is described in the following code example:

.. code-block:: javascript

  // color the whole structure in red, while generating the geometry.
  var geom = pv.lines('myStructure', myStructure,  { color: color.uniform('red') });
  // oh, no, I changed my mind: We wan't everything in blue!
  geom.colorBy(color.uniform('blue'));

Coloring is implemented with coloring operations. These operations are small function objects which map a certain atom or residue to a color. They can be as simple as coloring a complete structure in :func:`one color <color.uniform>`, or as complex as mapping a :func:`float property to a color gradient <color.byAtomProp>`. PV includes a variety of coloring operations for the most common tasks. For more complex applications it is also possible to extend the coloring with new operations.

Available color operations
--------------------------------------------------------------------------


The following color operations are available:

.. function:: color.uniform([color])

  Colors the structure with a uniform color. 

  :param color: a valid color identifier, or rgb instance to be used for the structure. Defaults to red.

.. function:: color.byElement()

  Applies the `CPK coloring scheme <http://en.wikipedia.org/wiki/CPK_coloring>`_ to the atoms. For example, carbon atoms are colored in light-grey, oxygen in red, nitrogen in blue, sulfur in yellow.


.. function:: color.byChain([gradient])

  Applies a unique uniform color for each chain in the structure. The chain colors are drawn from a gradient, which guarantees that chain colors are unique. 

  :param gradient: An optional gradient to draw colors from. Defaults to a rainbow gradient.


.. function:: color.ssSuccession([gradient[,coilColor]])

  Colors the structure's secondary structure elements with a gradient, keeping the color constant for each secondary structure element. Coil residues, and residue without secondary structure (e.g. ligands) are a colored with *coilColor*.

  :param gradient: The graident to draw colors from. Defaults to rainbow.
  :param coilColor: The color for residues without regular secondary structure. Defaults to lightgrey.

.. function:: color.bySS()

  Colors the structure based on secondary structure type of the residue. Distinct colors are used for helices, strands and coil residues.

.. function:: color.rainbow([gradient])

  Maps the residue's chain position (its index) to a color gradient. 

  :param gradient: An optional gradient to draw colors from. Defaults to a rainbow gradient.

.. function:: color.byAtomProp(prop [,gradient [,range]])
              color.byResidueProp(prop [,gradient [,range]])

  Colors the structure by mapping a float property to a color gradient. :func:`color.byAtomProp` uses properties from atoms, whereas :func:`color.byResidueProp` uses properties from residues. By default, the range of values is automatically determined from the property values and set to the minimum and maximum of observed values. Alternatively, the range can also be specified as the last argument.

  :param prop: name of the property to use for coloring. It is assumed that
     the property is numeric (floating point or integral). The name can either
     refer to a custom property, or a built-in property of atoms or residues.
  :param gradient: The graident to use for coloring. Defaults to rainbow.
  :param range: an array of length two specifying the minimum and maximum value of the float properties. When not specified, the value range is determined from observed values.


.. _pv.color.opacity:

Opacity
--------------------------------------------------------------------------

In addition to RGB color, the opacity of structures can be controlled as well. Opacity (alpha) is handled like the other RGB components. To render a structure semi-transparently, simply pass a color with an alpha smaller than one to the color operations. 

Additionally, the opacity of a rendered structure can directly be changed by calling :func:`BaseGeom.setOpacity`, for example, to change the opacity of all structures to 0.5,

.. code-block:: javascript

  // assuming viewer is an instance of pv.Viewer
  viewer.forEach(function(object) {
    object.setOpacity(0.5);
  });

Adding a new color operation
--------------------------------------------------------------------------

A coloring operation is essentially an object with 3 methods:

  * `colorFor` is called on every atom of the structure (or carbon alpha atoms for trace-based rendering styles.
  * `begin` is called once before coloring a structure, allowing for preprocessing such as determining the number of chains in the structure. `begin` may be undefined, in which case it is ignored.
  * `end` is called after coloring a structure, allowing or cleanup and freeing of resources. `end` may be undefined in which case it is ignored.

The following will add a new color operation which colors atoms based on their index. Atoms with an even index will be colored in red, atoms with an odd index will be colored in blue. 


.. code-block:: javascript

  function evenOdd() {
    return new ColorOp(function(atom, out, index) {
      if (atom.index() % 2 === 0) {
        out[index+0] = 1.0; out[index+1] = 0.0; 
        out[index+2] = 0.0; out[index+3] = 1.0;
      } else {
        out[index+0] = 0.0; out[index+1] = 0.0; 
        out[index+2] = 1.0; out[index+3] = 1.0;
      }
    });
  }

.. _pv.color.notation:

Color Notations
--------------------------------------------------------------------------

Whenever a function takes a color as its argument, these colors can be specified in different ways:

- using RGB hex-code notation with an optional alpha value. Either as 6 (8 with alpha) hexadecimal numbers, or as 3 (4 with alpha) hexadecimal numbers. These color strings must be prefixed with a hash (``'#'``) sign. Examples: ``'#badcode'``, or ``'#abc'``. 

- as an array of floating-point values. Each RGBA component is in the range between 0 and 1. The array must either be of length 3 (implicit alpha of 1.0) or length 4. 
- as one of the hardcoded color strings

  +-----------+--------------+----------------+
  | white     | black        |                |
  +-----------+--------------+----------------+
  | grey      | lightgrey    | darkgrey       |
  +-----------+--------------+----------------+
  | red       | darkred      | lightred       |
  +-----------+--------------+----------------+
  | green     | darkgreen    | lightgreen     |
  +-----------+--------------+----------------+
  | blue      | darkblue     | lightblue      |
  +-----------+--------------+----------------+
  | yellow    | darkyellow   | lightyellow    |
  +-----------+--------------+----------------+
  | cyan      | darkcyan     | lightcyan      |
  +-----------+--------------+----------------+
  | magenta   | darkmagenta  | lightmagenta   |
  +-----------+--------------+----------------+
  | orange    | darkorange   | lightorange    |
  +-----------+--------------+----------------+

Examples
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

  // These colors are all the same (guess what)
  var color1 = [ 1, 0, 0 ]; // implicit alpha of 1
  var color2 = [ 1, 0, 0, 1 ]; 
  var color3 = 'red';
  var color4 = '#f00';      // implicit alpha of f
  var color5 = '#ff0000';   // implicit alpha of ff
  var color6 = '#ff0000ff'; 
  var color7 = '#f00f'; 


