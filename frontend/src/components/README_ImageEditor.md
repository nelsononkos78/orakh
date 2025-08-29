# 🖼️ Editor de Imágenes

## Descripción

Componente de editor de imágenes con controles rápidos para cambiar tamaño y posición de imágenes de manera intuitiva.

## Características

### 📏 Controles de Tamaño
- **Pequeño**: 200x150px
- **Mediano**: 300x225px  
- **Normal**: 400x300px
- **Grande**: 600x450px
- **Personalizado**: Campos de entrada para ancho y alto específicos

### 📍 Controles de Posición
- **Izquierda**: Alinea la imagen a la izquierda
- **Centro**: Centra la imagen
- **Derecha**: Alinea la imagen a la derecha
- **Personalizado**: Opciones avanzadas de posicionamiento

### 👁️ Vista Previa en Tiempo Real
- Muestra los cambios instantáneamente
- Contenedor con fondo para mejor visualización
- Transiciones suaves

## Uso

### Importación
```tsx
import ImageEditor from './components/ImageEditor'
```

### Implementación Básica
```tsx
const [showEditor, setShowEditor] = useState(false)
const [imageSettings, setImageSettings] = useState({
  size: 'normal',
  position: 'center'
})

const handleSave = (settings) => {
  setImageSettings(settings)
  setShowEditor(false)
}

return (
  <div>
    <button onClick={() => setShowEditor(true)}>
      Editar Imagen
    </button>
    
    {showEditor && (
      <ImageEditor
        imageUrl="https://ejemplo.com/imagen.jpg"
        onSave={handleSave}
        onCancel={() => setShowEditor(false)}
      />
    )}
  </div>
)
```

### Aplicar Estilos
```tsx
const getImageStyle = () => {
  const baseStyle = {
    maxWidth: '100%',
    height: 'auto',
    objectFit: 'contain'
  }

  // Aplicar tamaño
  if (imageSettings.size === 'custom' && imageSettings.customWidth && imageSettings.customHeight) {
    baseStyle.width = `${imageSettings.customWidth}px`
    baseStyle.height = `${imageSettings.customHeight}px`
  } else if (imageSettings.width && imageSettings.height) {
    baseStyle.width = `${imageSettings.width}px`
    baseStyle.height = `${imageSettings.height}px`
  }

  // Aplicar posición
  switch (imageSettings.position) {
    case 'left':
      baseStyle.marginRight = 'auto'
      baseStyle.marginLeft = '0'
      break
    case 'center':
      baseStyle.marginLeft = 'auto'
      baseStyle.marginRight = 'auto'
      break
    case 'right':
      baseStyle.marginLeft = 'auto'
      baseStyle.marginRight = '0'
      break
  }

  return baseStyle
}
```

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `imageUrl` | `string` | URL de la imagen a editar |
| `onSave` | `(settings: ImageSettings) => void` | Callback cuando se guardan los cambios |
| `onCancel` | `() => void` | Callback cuando se cancela la edición |

## Interfaces

```tsx
interface ImageSettings {
  size: 'small' | 'medium' | 'normal' | 'large' | 'custom'
  position: 'left' | 'center' | 'right' | 'custom'
  width?: number
  height?: number
  customWidth?: number
  customHeight?: number
}
```

## Demo

Para ver el editor en acción, visita:
```
http://localhost:2800/image-editor
```

## Características Técnicas

- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Accesible**: Controles de teclado y lectores de pantalla
- **Performance**: Optimizado para renderizado eficiente
- **TypeScript**: Tipado completo para mejor desarrollo
- **CSS-in-JS**: Estilos encapsulados y modulares

## Personalización

### Cambiar Tamaños Predefinidos
```tsx
const sizeOptions = [
  { value: 'small', label: 'Pequeño', width: 200, height: 150 },
  { value: 'medium', label: 'Mediano', width: 300, height: 225 },
  // Agregar más opciones...
]
```

### Modificar Estilos
Los estilos están definidos usando CSS-in-JS y pueden ser personalizados modificando el objeto `style` en el componente.

## Compatibilidad

- ✅ React 16.8+
- ✅ TypeScript 4.0+
- ✅ Navegadores modernos
- ✅ Dispositivos móviles 