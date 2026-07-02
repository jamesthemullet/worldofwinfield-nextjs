import type { NextApiRequest, NextApiResponse } from 'next';
import handler from './exit-preview';

function createMockReq(): NextApiRequest {
  return {} as NextApiRequest;
}

function createMockRes(): NextApiResponse {
  return {
    setDraftMode: jest.fn(),
    writeHead: jest.fn(),
    end: jest.fn(),
  } as unknown as NextApiResponse;
}

describe('exit-preview API', () => {
  it('disables draft mode', async () => {
    const req = createMockReq();
    const res = createMockRes();
    await handler(req, res);
    expect(res.setDraftMode as jest.Mock).toHaveBeenCalledWith({ enable: false });
  });

  it('redirects to the homepage with a 307', async () => {
    const req = createMockReq();
    const res = createMockRes();
    await handler(req, res);
    expect(res.writeHead as jest.Mock).toHaveBeenCalledWith(307, { Location: '/' });
    expect(res.end as jest.Mock).toHaveBeenCalled();
  });
});
