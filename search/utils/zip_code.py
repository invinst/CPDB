# Chicago IL 123456
def get_zipcode_from_city(str):
    zip_code = str.split()[-1]
    if zip_code.isdigit():
        return zip_code
    else:
        return ''
