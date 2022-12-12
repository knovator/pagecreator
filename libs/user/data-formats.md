## Data Formats

## WidgetData
- `_id` => string
- `name` => string
- `code` => string
- `autoPlay` => boolean
- `isActive` => boolean
- `widgetTitle` => string
- `webPerRow` => number
- `mobilePerRow` => number
- `tabletPerRow`: number
- `itemsType` => 'Image' | string
- `widgetType` => 'FixedCard' | 'Carousel'
- `items` =>  ItemData[]
- `collectionItems` => CollectionItemType[]
}

## ItemData
- `_id` => string
- `title` => string
- `altText` => string
- `link` => string
- `itemType` => 'Web' | 'Mobile'
- `img` => ImgData

## CollectionItemType
- `_id` => string
- `name` (optional) => string;

## PageData
- `_id` => string
- `name` => string
- `code` => string
- `widgets` => [WidgetData](#widgetdata)[];
