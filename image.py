#!/usr/bin/python
# coding: UTF-8
import uuid
from pyexiv2 import ImageMetadata as Metadata
import Image, os

class GPSImage:
    def __init__(self, dirname, filename):
        self.path = dirname + '/' + filename #improve this using os.utils and concatenate locations
        self.filename = filename
        self.dirname = dirname
        self.id = str(uuid.uuid4())
        
        self.thumb = self.generate_thumbnail()
        
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
            
            print "GPS tags not available for " + self.filename
        
        
        #The EXIF data may optionally embed a thumbnail in the JPEG or TIFF format. The thumbnail can be accessed, set from a JPEG file or buffer, saved to disk and erased:
        #thumb = metadata.exif_thumbnail
        #thumb.set_from_file('/tmp/thumbnail.jpg')
        #thumb.write_to_file('/tmp/copy')
        #thumb.erase()
        #metadata.write()
        
    def generate_thumbnail(self):
        ext = ".jpg"
        thumbs_dir = self.create_thumbs_dir()
        thumb_img = thumbs_dir + self.filename.split(".")[0] + "_thumb" + ext 
        
        if os.path.exists(thumb_img):
            print "Thumb for " + self.filename + " found & skipped."
            return thumb_img
        
        image = Image.open(self.path)
        image = image.resize((128, 128), Image.ANTIALIAS)
        
        image.save(thumb_img)
        return thumb_img
        
        
    def create_thumbs_dir(self):
        dir_path = self.dirname + "/.thumbs/"
        
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
        return dir_path    
        
    def print_gps_data(self):
        
        keys = [
            'Exif.GPSInfo.GPSMeasureMode',
            'Exif.GPSInfo.GPSVersionID',
            'Exif.GPSInfo.GPSLatitudeRef',
            'Exif.GPSInfo.GPSLatitude',
            'Exif.GPSInfo.GPSLongitudeRef',
            'Exif.GPSInfo.GPSLongitude',
            'Exif.GPSInfo.GPSTimeStamp',
            'Exif.GPSInfo.GPSSatellites'
        ]

        for key in keys:
            print self.metadata[key].raw_value
        
    def print_coords(self):
        print 'Longitude: ' + str(self.lng) 
        print 'Latitude: ' + str(self.lat)
        print ''
        
    def coord_to_decimal(self, coord):
        (degree, minute, second) = coord.value
        return (float(degree.numerator)/degree.denominator +
            float(minute.numerator)/minute.denominator/60 +
            float(second.numerator)/second.denominator/3600)
            
    
