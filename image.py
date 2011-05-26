##!/usr/bin/python
# coding: UTF-8
from pyexiv2 import ImageMetadata as Metadata

class GPSImage:
    def __init__(self, dirname, filename):
        self.path = dirname + '/' + filename #improve this using os.utils and concatenate locations
        self.filename = filename
        self.dirname = dirname
        
        try:
            self.metadata = Metadata(self.path)
            
            self.metadata.read()
        except IOError:
            print "File " + self.path + " is not a valid image file"
        
        try:
            self.lng_tuple = self.metadata['Exif.GPSInfo.GPSLongitude']
            self.lat_tuple = self.metadata['Exif.GPSInfo.GPSLatitude']
            
            self.lng = self.coord_to_decimal(self.lng_tuple)
            self.lat = self.coord_to_decimal(self.lat_tuple)
       
            self.lng_ref = self.metadata['Exif.GPSInfo.GPSLongitudeRef'].value
            self.lat_ref = self.metadata['Exif.GPSInfo.GPSLatitudeRef'].value
        
            if(self.lng_ref == 'W'):
                self.lng = - self.lng
            if(self.lat_ref == 'S'):
                self.lat = - self.lat
        except KeyError:
            self.lng = 0
            self.lat = 0
            
            print "GPS tags not available"
        
        
            
        
    def print_gps_data(self):
        print self.metadata['Exif.GPSInfo.GPSMeasureMode'].raw_value
        print self.metadata['Exif.GPSInfo.GPSVersionID'].raw_value
        print self.metadata['Exif.GPSInfo.GPSLatitudeRef'].value
        print self.metadata['Exif.GPSInfo.GPSLatitude'].value
        print self.metadata['Exif.GPSInfo.GPSLongitudeRef'].value
        print self.metadata['Exif.GPSInfo.GPSLongitude'].value
        print self.metadata['Exif.GPSInfo.GPSTimeStamp'].raw_value
        print self.metadata['Exif.GPSInfo.GPSSatellites'].raw_value
       #  Extra available Tags : 
        #       'Exif.GPSInfo.GPSStatus', 'Exif.GPSInfo.GPSMeasureMode',
        #       'Exif.GPSInfo.GPSDOP', 'Exif.GPSInfo.GPSMapDatum',
        #       'Exif.GPSInfo.GPSProcessingMethod', 'Exif.GPSInfo.GPSDateStamp' 
        
    def print_coords(self):
        print 'Longitude: ' + str(self.lng) 
        print 'Latitude: ' + str(self.lat)
        print ''
        
    def coord_to_decimal(self, coord):
        (degree, minute, second) = coord.value
        return (float(degree.numerator)/degree.denominator +
            float(minute.numerator)/minute.denominator/60 +
            float(second.numerator)/second.denominator/3600)
    
    
    ''' Deprecated methods from here downwards
        These methods use tuple coordinates. Actual methods use decimal values '''
    def coord_to_string(self, coord):
        (degree, minute, second) = coord.value
        d = float(degree.numerator) / degree.denominator
        m = float(minute.numerator) / minute.denominator
        s = float(second.numerator) / second.denominator
        
        return str(d) + "° " + str(m) + "' " + str(s) + "\"" 
    
    def get_degree(self, coord):
        fraction = coord.value[0]
        return float(fraction.denominator) / fraction.numerator
        
    def get_minutes(self, coord):
        fraction = coord.value[1]
        return float(fraction.denominator) / fraction.numerator
    
    def get_seconds(self, coord):
        fraction = coord.value[2]
        return float(fraction.denominator) / fraction.numerator
        
    
