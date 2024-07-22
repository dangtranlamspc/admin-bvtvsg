declare module 'jodit-react' {
    import { IJodit } from 'jodit';
    import { RefObject } from 'react';
  
    interface JoditProps {
      value: string;
      config?: IJodit['options'];
      onChange?: (newContent: string) => void;
      onBlur?: (newContent: string) => void;
    }
  
    const JoditEditor: React.ForwardRefExoticComponent
      JoditProps & { ref?: RefObject<IJodit> }
    >;
  
    export default JoditEditor;
  }