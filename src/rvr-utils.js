/**
 * Created by IvanP on 27.10.2016.
 */

/** class with utilities for RVR */
class RVRutils {
  /**
   * Copies props from a source object to a target object.
   * @param {Object} target Target object to copy properties to.
   * @param {Object} source Source object to copy properties from.
   * @return {Object} Target object that was passed as first argument.
   */
  static mixin(target, source) {
    for (let i in source) {
      target[i] = source[i];
    }
    return target;
  }

  /**
   * Gets a color/opacity palette from `variables`. If no palette `name` is passed, it gets the default `userPalette`.
   * @param {Object} variables - variables object to get palette from
   * @param {String} [name] - palette name
   * @returns {Object} Returns a palette
   * */
  static getPalette(variables,name){
    if(variables && typeof variables == 'object'){
      if(variables.palettes && typeof variables.palettes == 'object'){
        // if palette name is specified explicitly
        if(name){
          if(variables.palettes[name] && typeof variables.palettes[name] == 'object'){
            return variables.palettes[name]
          } else {
            console.error(`Palette "${name}" doesn't exist, will use a default one instead`);
            return variables.palettes.default;
          }
        }
        // if there are user settings for a palette
        if(variables.userPalette && variables.palettes[variables.userPalette]){
          return variables.palettes[variables.userPalette]
        } else {
          console.warn(`User palette is not defined, will use a default one instead`);
          return variables.palettes.default;
        }
      } else {
        throw new TypeError('palettes is undefined in variables, or is not an object')
      }
    } else {
      throw new TypeError('variables are empty')
    }
  }

  /**
   * Creates an `<a-entity>` with parameters
   * @param {String} [name] - entity name if it's a primitive
   * @param {Object} properties - an object with attribute names as keys
   * @returns {HTMLElement} Returns an `<a-entity>` element configured with attributes
   * */
  static createEntity(name,properties){
    let entity;
    if(typeof name == 'string' && name.indexOf('a-')==0 && name!=null){ // name for entity is specified
      entity = document.createElement(name);
    } else {
      entity = document.createElement('a-entity');
    }
    if(typeof properties == 'object'){
      RVRutils.setProperties({entity, batch:true, properties});
    }
    return entity
  }

  /**
   * Sets properties on an entity
   * @param {Object} options
   * @param {HTMLElement} options.entity - the created entity that needs to have parameters set on it
   * @param {Object} options.properties - properties that need setting on the entity
   * @param {String} options.parentProp - the name of a parent property `properties` belong to
   * @param {Boolean} [options.batch=false] - whether all properties need to be applied at once (which replaces all params of the component)
   * */
  static setProperties(options){
    let {entity, properties, parentProp, batch=false} = options;
    for(let key in properties){
      let prop;
      if(batch) {
        entity.setAttribute(key, properties[key]);
      } else {
        if(!(typeof properties[key] == 'object' && !properties[key].x)){
          typeof parentProp == 'string' ? entity.setAttribute(parentProp, key , properties[key]) : entity.setAttribute(key, properties[key]);
        } else if(typeof properties[key] == 'object'){
          RVRutils.setProperties({entity, properties:properties[key], parentProp:key});
        }
      }
    }
  }

  /**
   * Utility function to transfer a CSS class from one element to another. If `to` isn't specified and `from` doesn't have the class name, it will be given one
   * @param {String} className - name of the class to be moved
   * @param {HTMLElement} from - element containing class
   * @param {HTMLElement} to - element the class will be transferred to
   * */
  static classFollows(className,to,from){
    if(to){to.classList.add(className)}
    if(from){from.classList.remove(className)}
  }

  /**
   * turns `window.location` object into an object with params as named keys necessary to reconstruct the URL
   * @param {Object=} [location = window.location] - a window.location object, by default of the host window where the script is executed
   * @returns {{path:String, query:Object}} a `location` object
   * */
  static locationDeserialize(location = window.location){
    let o = {
      path: location.origin + location.pathname,
      query:{}
    };
    location.search.substring(1).split(/&/).forEach(pair=>{
      let aPair= pair.split(/=/);
      o.query[aPair[0].toLowerCase()] = aPair[1]
    });
    return o
  }

  /**
   * Turns a `location` object (result of `locationDeserialize`) into a URL
   * @param {{path:String, query:Object}} location - an object with params and a url
   * @returns {String} - a URL string
   * */
  static locationSerialize(location){
    let query=[];
    for(let key in location.query){
      query.push([key,location.query[key]].join('='));
    }
    return location.path + '?' + query.join('&');
  }

  /**
   * Creates a named event with `name`
   * @param {String} name - name of the event
   * @return {Event} Returns a created event
   * */
  static newEvent(name){
    let event = document.createEvent('Event');
    event.initEvent(name, true, true);
    return event;
  }

  /** Creates a GUID */
  static guid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }


}

export default RVRutils
