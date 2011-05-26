#!/usr/bin/python
# coding: UTF-8
import sys, os
import pyexiv2, json
from optparse import OptionParser
from image import GPSImage


class Main:
    def __init__(self):
        self.images = []  #list of GPSImages
        
    def main(self, argv):
        self.parser = OptionParser()
        (opts, args) = self.parse_options()

        self.target_dir = opts.target_dir

        #print opts

        if opts.target_dir is None:
            print "Error: You should specify the images directory\n"
            self.parser.print_help()
            exit(-1)

        #filelist = self.get_files()

        files = os.listdir(self.target_dir)
        
        
        for f in files: 
            try:
                img = GPSImage(self.target_dir,f)
                self.images.append(img)
                #img.print_gps_data()
                img.print_coords()
                #img.print_gps_data()
            except IOError:
                pass
         
        print self.generate_data_array()
         
         
    def parse_options(self):
        self.parser.add_option("-d", "--dir", dest="target_dir", 
                          help="directory with pictures with EXIF GPS metadata")
        
        return self.parser.parse_args()
        
    def generate_data_array(self, filename="static/js/data.js"):
        d = {}
        content = "var data = "
        for img in self.images:
            d[img.path] = {
                'lng': img.lng, 
                'lat': img.lat
                }
        
        content += json.dumps(d, sort_keys=True, indent=4)
                
        f = open(filename, 'w')
        f.write(content)
        f.close()
        print "Saved data file at " + filename
        return content
    
        
if __name__ == '__main__':
    main = Main()
    main.main(sys.argv)



