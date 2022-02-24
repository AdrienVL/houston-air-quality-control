//=============PROPS======================//

Props are also how you pass data from one component to another, as parameters.



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


//Avoid Refs

//Creating refs in ReactJS is very simple. Refs are generally used for the following purposes:

// Managing focus, text selection, or media playback.
// Triggering imperative animations.
// Integrating with third-party DOM libraries.
// Note: You should avoid using refs for anything that can be done declaratively.


// ==========REFS VS STATE==============//
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

