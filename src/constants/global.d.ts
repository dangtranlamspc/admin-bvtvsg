declare module '@ckeditor/ckeditor5-react' {
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    import Event from '@ckeditor/ckeditor5-utils/src/eventinfo'
    import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig'
  
    const CKEditor: React.FC<{
      editor: typeof ClassicEditor;
      data?: string;
      onChange?: (event: Event, editor: ClassicEditor) => void;
      config?: EditorConfig;
    }>;
  
    export { CKEditor };
  }
  
  declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditor: any;
    export = ClassicEditor;
  }