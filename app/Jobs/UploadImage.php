<?php

namespace App\Jobs;

use Bepsvpt\Blurhash\Facades\BlurHash;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Intervention\Image\Facades\Image;

class UploadImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $image;
    protected $width;
    protected $height;
    protected $path;
    public function __construct($image, $width, $height, $path)
    {
        $this->image = $image;
        $this->width = $width;
        $this->height = $height;
        $this->path = $path;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Image::make($this->image)->resize($this->width, $this->height)->encode("webp")
            ->save($this->path);
    }
}
