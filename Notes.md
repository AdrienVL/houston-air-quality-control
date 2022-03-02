********************** To Improve ******************

Mapbox Layer Marker Implementation (save Marker coordinates in GeoJson, then load to map) rather than interacting with Marker HTML - Marker and Popup components (Query by ID, rather than coordinates)
Extra API call - locations


//=============PROPS======================//

Props are also how you pass data from one component to another, as parameters.

Props are inputs for both types of components. One of the main tasks of props is to pass information from component to component. It’s especially necessary if you want to build a dynamic user interface. However, there is one important rule that you shouldn’t forget: props are read-only. That means that all React components shouldn’t change their inputs and the same props must return the same result. Components that respect their props are called “pure”. That rule works both for class and function components. 



function Car(props) {
  return <h2>I am a { props.brand }!</h2>;
}

function Garage() {
  return (
    <>
      <h1>Who lives in my garage?</h1>
      <Car brand="Ford" />
    </>
  );
}

ReactDOM.render(<Garage />, document.getElementById('root'));



//============REFS=============//


************************************* Refs and MAPBOX

Refs are a function provided by React to access the DOM element and the React element that you might have created on your own.

The Mapbox map is initialized within a React Effect hook

The container option tells Mapbox GL JS to render the map inside a specific DOM element. Here, the app expects to receive a mapContainer useRef or ref.

If you are using hooks, you also created a map useRef to store the initialize the map. The ref will prevent the map from reloading when the user interacts with the map.

*************************************


//Avoid Refs

//Creating refs in ReactJS is very simple. Refs are generally used for the following purposes:

// Managing focus, text selection, or media playback.
// Triggering imperative animations.
// Integrating with third-party DOM libraries.
// Note: You should avoid using refs for anything that can be done declaratively.

Let’s say you want to change the value of an <input> element, but without using props or re-rendering the whole component.


// ==========REFS VS STATE==============//


*********************************************
The state is an instance of React Component Class can be defined as an object of a set of observable properties that control the behavior of the component. In other words, the State of a component is an object that holds some information that may change over the lifetime of the component. 
*********************************************


// Commonalities to both useState() and useRef():

// Available in functional components only
// Create static values – value persists between function calls
// Values are mutable
// Are scoped within their function component
// Scope includes other hooks (use’s) within their function component

// Differences between useState() and useRef():

// useState triggers re-render, useRef does not.
// useRef can reference child elements (via “ref={}”), useState can’t.
// For child DOM elements, ref={} refers to the DOM element itself.
// For child React components, ref={} refers to the child component itself.

//=================HOOKS============//

//HOOKS - They let you use state and other React features without writing a class.

Here, useState is a Hook (we’ll talk about what this means in a moment). We call it inside a function component to add some local state to it. React will preserve this state between re-renders. useState returns a pair: the current state value and a function that lets you update it. You can call this function from an event handler or somewhere else. It’s similar to this.setState in a class, except it doesn’t merge the old and new state together. (We’ll show an example comparing useState to this.state in Using the State Hook.)

The only argument to useState is the initial state. In the example above, it is 0 because our counter starts from zero. Note that unlike this.state, the state here doesn’t have to be an object — although it can be if you want. The initial state argument is only used during the first render.

You’ve likely performed data fetching, subscriptions, or manually changing the DOM from React components before. We call these operations “side effects” (or “effects” for short) because they can affect other components and can’t be done during rendering.

The Effect Hook, useEffect, adds the ability to perform side effects from a function component. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API. (We’ll show examples comparing useEffect to these methods in Using the Effect Hook.)

//================DOM====================//

The Document Object Model (DOM) is a programming interface for HTML and XML(Extensible markup language) documents. It defines the logical structure of documents and the way a document is accessed and manipulated.

HTML is used to structure the web pages and Javascript is used to add behavior to our web pages. When an HTML file is loaded into the browser, the javascript can not understand the HTML document directly. So, a corresponding document is created(DOM). DOM is basically the representation of the same HTML document but in a different format with the use of objects. Javascript interprets DOM easily i.e javascript can not understand the tags(<h1>H</h1>) in HTML document but can understand object h1 in DOM. Now, Javascript can access each of the objects (h1, p, etc) by using different functions.

Why called an Object Model?
Documents are modeled using objects, and the model includes not only the structure of a document but also the behavior of a document and the objects of which it is composed of like tag elements with attributes in HTML.


SEE DOM IMAGE 

Window Object: Window Object is always at top of the hierarchy.
Document object: When an HTML document is loaded into a window, it becomes a document object.
Form Object: It is represented by form tags.
Link Object: It is represented by link tags.
Anchor Object: It is represented by a href tags.
Form Control Elements:: Form can have many control elements such as text fields, buttons, radio buttons, and checkboxes, etc.

getElementById()’ or ‘getElementByClass()’ method to modify the content of DOM.

Every time there is a change in the state of your application, the DOM get’s updated to reflect that change in the UI. Though doing things like this is not a problem and it works fine, but consider a case where we have a DOM that contains nodes in a large number, and also all these web elements have different styling and attributes. 

When writing the above code in the console or in the JavaScript file, these things happen: 

The browser parses the HTML to find the node with this id.
It removes the child element of this specific element.
Updates the element(DOM) with the ‘updated value’.
Recalculates the CSS for the parent and child nodes.
Update the layout.
Finally, traverse the tree and paint it on the screen(browser) display.


=======================REACTJS Virtual DOM================================

React has a different approach to dealing with this, as it makes use of something known as Virtual DOM.

Virtual DOM: React uses Virtual DOM exists which is like a lightweight copy of the actual DOM(a virtual representation of the DOM). So for every object that exists in the original DOM, there is an object for that in React Virtual DOM. 

 So each time there is a change in the state of our application, virtual DOM gets updated first instead of the real DOM. You may still wonder, “Aren’t we doing the same thing again and doubling our work? How can this be faster?” Read below to understand how things will be faster using virtual DOM.

How Virtual DOM actually make the things faster: When anything new is added to the application, a virtual DOM is created and it is represented as a tree. Each element in the application is a node in this tree. So, whenever there is a change in state of any element, a new Virtual DOM tree is created. This new Virtual DOM tree is then compared with the previous Virtual DOM tree and make a note of the changes. After this, it finds the best possible ways to make these changes to the real DOM. Now only the updated elements will get rendered on the page again.

How Virtual DOM helps React: In react, everything is treated as a component be it a functional component or class component. A component can contain a state. Each time we change something in our JSX file or let’s put it in simple terms, whenever the state of any component is changed react updates it’s Virtual DOM tree. Though it may sound that it is ineffective but the cost is not much significant as updating the virtual DOM doesn’t take much time. React maintains two Virtual DOM at each time, one contains the updated Virtual DOM and one which is just the pre-update version of this updated Virtual DOM. Now it compares the pre-update version with the updated Virtual DOM and figures out what exactly has changed in the DOM like which components have been changed. This process of comparing the current Virtual DOM tree with the previous one is known as ‘diffing’. Once React finds out what exactly has changed then it updated those objects only, on real DOM. React uses something called as batch updates to update the real DOM. It just mean that the changes to the real DOM are sent in batches instead of sending any update for a single change in the state of a component. We have seen that the re-rendering of the UI is the most expensive part and React manages to do this most efficiently by ensuring that the Real DOM receives batch updates to re-render the UI. This entire proces of transforming changes to the real DOM is called Reconciliation

=======================Functional Components================================


Functional Components: Functional components are simply javascript functions. We can create a functional component in React by writing a javascript function. These functions may or may not receive data as parameters, we will discuss this later in the tutorial. Below example shows a valid functional component in React: 
 
const Democomponent=()=>
{
    return <h1>Welcome Message!</h1>;
}

Class Components: The class components are a little more complex than the functional components. The functional components are not aware of the other components in your program whereas the class components can work with each other. We can pass data from one class component to other class components. We can use JavaScript ES6 classes to create class-based components in React. Below example shows a valid class-based component in React: 
 
class Democomponent extends React.Component
{
    render(){
          return <h1>Welcome Message!</h1>;
    }
}

=================================Func vs class components==========================

Differentiating Functional vs Class components
1.State and lifecycle
Well, the standard answer to the question about the difference between functional and class components was that class components provide developers with such features as setState() and lifecycle methods componentDidMount(), componentWillUnmoun(), etc., while functional components don’t. That was true because functional components are plain JavaScript functions that accept props and return React elements, while class components are JavaScript classes that extend React.Component which has a render method. Both state and lifecycle methods come from React.Component, so they were available only for class components. The widespread advice was something like that: “Go with functional if your component doesn’t do much more than take in some props and render”. You had no options on how to build complex UI and class components dominated in React development for a while.

However, that has changed with the introduction of Hooks. To replace setState method to work with the state in class components React offers useState Hook.
To work with components lifecycle classes have such methods like componentDidMount, componentWillUnmount, componentWillUpdate, componentDidUpdate, shouldComponentUpdate. Functional components have got a tool to work with the same methods using only one Hook useEffect. You can think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined. 

Standard class methods work well but do look not very elegant. Functional components offer an elegant and simple decision: instead of using multiple lifecycle methods, we can replace them with one Hook useEffect. What React developers write about Hooks:


Handling state.
To handle state functional components in React offer useState()Hook. We assign the initial state of count equal to 0 and set the method setCount() that increases it by one every time we click a button. The component returns the number of times we clicked the button and the button itself. The initial state is used only during the first render. The type of argument can be a number, string, object, or null. To learn more about that useState() Hook see the official documentation.  

const FunctionalComponent = () => {
const [count, setCount] = React.useState(0);
return (
<div>
<p>count: {count}</p>
<button onClick={() => setCount(count + 1)}>Click</button>
</div>
);
};

Class components work a bit differently. They use setState() function, require a constructor, and this keyword. 

class ClassComponent extends React.Component {
constructor(props) {
super(props);
this.state = {
count: 0
};
}

render() {
return (
<div>
<p>count: {this.state.count} times</p>
<button onClick={() => this.setState({ count: this.state.count + 1 })}>
Click
</button>
</div>
);
}
}




The underlying logic is similar to the logic in functional components. In constructor() we declare a state object, state key “count” and the initial value equal to 0. In render() method we use setState() function to update the value of our count using this.state.count and the app renders the number of times the button was clicked and displays the button itself. The result is the same, but the same functionality requires more lines of code for class components. However, it doesn’t mean that the code written with class components will be more cumbersome than the code made with functional components, but the code definitely will be bigger.


The useEffect Hook possesses two parameters: the first is the “effect” itself that is going to be called once after every render of the component. The second parameter is an array of observable state or states (or so-called a dependency list). useEffect Hook only runs if one of these states changes. Leaving the second parameter empty useEffect Hooks runs once after render.

=================================Markers vs. Layers ===================================================


Markers vs. Layers Summary
Markers are more appropriate for static data or small data points that you can easily manage manually—for example, the user's current location. Markers are easier to style with your own svgs or images via CSS, but they're harder to manage in large numbers and more difficult to interact with.

Larger, dynamic data sets are more manageable with layers. They're a bit more difficult to style (in my opinion), but much easier to interact with. You can add event listeners to the map that target specific layers by their unique ids and easily access and act upon the features in those layers, without having to manually manage the data.