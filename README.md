# Form Elements
---
A hopefully not-to-complex form built with support for validation.
Written in Vanilla JS on top of ExpressJS and Pug to handle styling and templating.
Supported formats of input are as follows.

- Text
- Number
- Time
- Date
- Checkbox
- Radio
- Textarea
- Select

```
<label
	[INITIATOR CLASS](.f-input) - Required to initiate component
	[MODIFIER?] - Apply one or more modifier classes
	[STATES!] - States are generally added via JS (See Below)
>
    <span> :: TEXT LABEL :: </span>
    <input
        [NAME] - Required to match DB keys
        [TYPE] - Required to identify an input
        [ID?] - Use for specific JS functions
        [PLACEHOLDER?] - Short assist text for input
        [REQUIRED?] - To designate a required field
        [DISABLED?] - To designate a disabled field
        [CHECKED?] - (Radio & Checkbox Only) To select a field
    /> 
    – or –
    <textarea
        [NAME] - Required to match DB keys
        [ID?] - Use for specific JS functions
        [PLACEHOLDER?] - Short assist text for input
        [REQUIRED?] - To designate a required field
        [DISABLED?] - To designate a disabled field
    />
    – or –
    <select
        [NAME] - Required to match DB keys
        [ID?] - Use for specific JS functions
        [REQUIRED?] - To designate a required field
        [DISABLED?] - To designate a disabled field
    />
        <option
            [VALUE] - Required to specify a value
            [SELECTED?] - To preselect a field
            [HIDDEN?] - To hide option from menu
        > :: TEXT :: </option>
</label>
```
## Javascript Features

**$ROOT.forms.disable(inputID)** - Disables input using the input's ID

**$ROOT.forms.enable(inputID)** - Enables input using the input's ID

**$ROOT.forms.require(inputID)** - Sets an input to be Required using the input's ID

**$ROOT.forms.reset(inputID)** - Resets the input using the input's ID

**$ROOT.forms.validation(formID, obj)** - Pass a validation object to the form element ID

**Validation Object**
```
{
    "INPUT_NAME": () => {
        --return true for valid tests--
        --return message for failed tests--
    }
}
```