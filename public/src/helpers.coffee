Helpers =
  Templates:
    text: Handlebars.compile """
    <div class='inline-field'>
      <label for="component_{{component}}_{{name}}">{{label}}</label><input type='text' name='{{name}}' id='component_{{component}}_{{name}}' value='{{value}}'/>
    </div>
    """
    checkbox: Handlebars.compile """
    <div class='checkbox-field'>
      <input type='checkbox' name='{{name}}' id='component_{{component}}_{{name}}' value='true' {{#if value}} checked{{/if}}/>
      <label for='component_{{component}}_{{name}}'>{{label}}</label>
    </div>
    """
    select: Handlebars.compile """
    <div class='inline-field'>
      <label for="component_{{component}}_{{name}}">{{label}}</label><select id='component_{{component}}_{{name}}' name='{{name}}'>
        {{#each options}}
        <option value="{{value}}"{{#if selected}} selected{{/if}}>{{label}}</option>
        {{/each}}
      </select>
    </div>
    """
    textarea: Handlebars.compile """
    <div class='block-field'>
      <label for="component_{{component}}_{{name}}">{{label}}</label><textarea name='{{name}}' id='component_{{component}}_{{name}}'>{{{value}}}</textarea>
    </div>
    """
  field: (options, value)->
    if Helpers[options.type]?
      Helpers[options.type](options, value)
    else
      Helpers.Templates[options.type](_.extend options, {value: value || options.default})
  select: (options, value)->
    selections = _.map options.options, (option)=>
      {label: option[0], value: option[1], selected: (value == option[1])}
    Helpers.Templates.select _.extend(_.clone(options), {options: selections, value: value || options.default})

if exports? then exports = Helpers else window.Helpers = Helpers