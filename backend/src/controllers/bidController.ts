import { Request, Response } from 'express';
import bidService from '../services/bidService';
import { AuthenticatedRequest } from '../middleware/auth';

export const createBid = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { job_id, proposed_price, timeline, proposal } = req.body;

    if (!job_id || !proposed_price || !timeline || !proposal) {
      res.status(400).json({ 
        error: 'Missing required fields: job_id, proposed_price, timeline, proposal' 
      });
      return;
    }

    const bid = await bidService.createBid({
      job_id,
      professional_id: req.user.userId,
      proposed_price: parseFloat(proposed_price),
      timeline: parseInt(timeline),
      proposal,
    });

    res.status(201).json(bid);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create bid' });
  }
};

export const getBidsForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { job_id } = req.query;

    if (!job_id || typeof job_id !== 'string') {
      res.status(400).json({ error: 'job_id query parameter is required' });
      return;
    }

    const bids = await bidService.getBidsForJob(job_id);
    res.json(bids);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to fetch bids' });
  }
};

export const getMyBids = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const bids = await bidService.getMyBids(req.user.userId);
    res.json(bids);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to fetch bids' });
  }
};

export const acceptBid = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { bid_id } = req.body;

    if (!bid_id) {
      res.status(400).json({ error: 'bid_id is required' });
      return;
    }

    const bid = await bidService.acceptBid(bid_id, req.user.userId);
    res.json({ message: 'Bid accepted successfully', bid });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to accept bid' });
  }
};

export const rejectBid = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { bid_id } = req.body;

    if (!bid_id) {
      res.status(400).json({ error: 'bid_id is required' });
      return;
    }

    const bid = await bidService.rejectBid(bid_id, req.user.userId);
    res.json({ message: 'Bid rejected successfully', bid });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to reject bid' });
  }
};
