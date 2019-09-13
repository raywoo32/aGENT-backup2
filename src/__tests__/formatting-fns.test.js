import {chkAndFltrForAGINames} from '../helper-fns/formatting-fns';

describe('basic AGI string check for filtering...',()=>{
  it('should return true for AT4G13220 and false for BLAH',()=>{
    expect(chkAndFltrForAGINames('AT4G13220').toBeTruthy);
  });

  it('should return false for BLAH',()=>{
    expect(chkAndFltrForAGINames('BLAH').toBeFalsy);
  });
});

describe('array AGI check for filtering...', ()=>{
  it('should return only return AGIs for ["At4g20000","BLAH","At4g10000"]',()=>{
    expect(chkAndFltrForAGINames(["At4g20000","BLAH","At4g10000"])).toEqual(["At4g20000", "At4g10000"]);
  });

  it('should remove duplicates for ["AT3G10000", "AT3G10000"]', ()=>{
    expect(chkAndFltrForAGINames(["AT3G10000", "AT3G10000"])).toEqual(["AT3G10000"]);
  })
});

