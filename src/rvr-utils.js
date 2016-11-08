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
   * @param {Boolean} [batch=true] - whether all properties need to be applied at once (which replaces everything)
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
   * */
  static setProperties(options){
    let {entity, properties, parentProp, batch=false} = options;
    for(let key in properties){
      let prop;
      if(batch) {
        entity.setAttribute(key, props[key]);
      } else {
        if(!(typeof properties[key] == 'object' && !properties[key].x)){
          typeof parentProp == 'string' ? entity.setAttribute(parentProp, key , properties[key]) : entity.setAttribute(key, properties[key]);
        } else if(typeof properties[key] == 'object'){
          RVRutils.setProperties({entity, properties:properties[key], parentProp:key});
        }
      }
    }
  }
}

export default RVRutils
