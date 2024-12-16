/**
 * The valid values for the "type" property of any GeoJSON object.
 */
export type GeoJsonTypes =
    | "FeatureCollection"
    | "Feature"
    | "Point"
    | "MultiPoint"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "GeometryCollection"

/**
 * A Position is an array of numbers. There must be at least two elements, 
 * and the order should be [longitude, latitude] with optional additional 
 * elements representing altitude or other properties.
 */
export type Position = [number, number] | [number, number, number] | [number, number, number, number] | number[] 

/**
 * Bounding box array: [west, south, east, north], or [west, south, east, north, min elevation, max elevation].
 * Note: RFC 7946 recommends the order [minLon, minLat, maxLon, maxLat].
 */
export type BBox = [number, number, number, number] | [number, number, number, number, number, number]

/**
 * GeoJSON objects may contain a "bbox" member, which is an array describing the bounding box of the feature.
 * They may also contain a "crs" member, though CRS is deprecated in RFC 7946.
 */
export interface GeoJsonObject {
    type: GeoJsonTypes
    bbox?: BBox
}

/**
 * A GeometryObject represents a geometry type in GeoJSON:
 * Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, or GeometryCollection.
 */
export type Geometry =
    | Point
    | MultiPoint
    | LineString
    | MultiLineString
    | Polygon
    | MultiPolygon
    | GeometryCollection

/**
 * A Point geometry: { type: "Point", coordinates: Position }
 */
export interface Point extends GeoJsonObject {
    type: "Point"
    coordinates: Position
}

/**
 * A MultiPoint geometry: { type: "MultiPoint", coordinates: Position[] }
 */
export interface MultiPoint extends GeoJsonObject {
    type: "MultiPoint"
    coordinates: Position[]
}

/**
 * A LineString geometry: { type: "LineString", coordinates: Position[] }
 * According to RFC 7946, a LineString must have two or more positions.
 */
export interface LineString extends GeoJsonObject {
    type: "LineString"
    coordinates: Position[]
}

/**
 * A MultiLineString geometry: { type: "MultiLineString", coordinates: Position[][] }
 * Each element in coordinates represents one LineString.
 */
export interface MultiLineString extends GeoJsonObject {
    type: "MultiLineString"
    coordinates: Position[][]
}

/**
 * A Polygon geometry: { type: "Polygon", coordinates: Position[][] }
 * Each element in coordinates represents a linear ring, which must have at least 4 positions forming a closed ring.
 */
export interface Polygon extends GeoJsonObject {
    type: "Polygon"
    coordinates: Position[][]
}

/**
 * A MultiPolygon geometry: { type: "MultiPolygon", coordinates: Position[][][] }
 * Each element in coordinates represents one Polygon.
 */
export interface MultiPolygon extends GeoJsonObject {
    type: "MultiPolygon"
    coordinates: Position[][][]
}

/**
 * A GeometryCollection geometry: { type: "GeometryCollection", geometries: Geometry[] }
 * Contains multiple geometries.
 */
export interface GeometryCollection extends GeoJsonObject {
    type: "GeometryCollection"
    geometries: Geometry[]
}

/**
 * A Feature represents a spatially bounded entity. 
 * It must have a "geometry" (or null) and a "properties" object.
 */
export interface Feature<G extends Geometry = Geometry, P = Record<string, unknown>> extends GeoJsonObject {
    type: "Feature"
    geometry: G | null
    properties: P | null
    id?: string | number
}

/**
 * A FeatureCollection is a set of Features.
 */
export interface FeatureCollection<G extends Geometry = Geometry, P = Record<string, unknown>> extends GeoJsonObject {
    type: "FeatureCollection"
    features: Array<Feature<G, P>>
}

/**
 * A type union that includes any valid GeoJSON object type.
 */
export type GeoJSON = 
    | Feature
    | FeatureCollection
    | Geometry
    | Point
    | MultiPoint
    | LineString
    | MultiLineString
    | Polygon
    | MultiPolygon
    | GeometryCollection
